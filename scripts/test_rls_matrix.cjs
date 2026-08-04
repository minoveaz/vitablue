/* Non-destructive RLS integration matrix. Configure credentials via environment variables. */
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const roles = ['viewer', 'editor', 'admin'];
const required = roles.flatMap((role) => [
  `VITABLUE_RLS_${role.toUpperCase()}_EMAIL`,
  `VITABLUE_RLS_${role.toUpperCase()}_PASSWORD`,
]);

if (!url || !anonKey || required.some((name) => !process.env[name])) {
  console.error(`Missing RLS test configuration. Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ${required.join(', ')}`);
  process.exit(2);
}

const clients = {};
const runId = `rls-test-${Date.now()}`;

function createTestClient() {
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function signIn(role) {
  const client = createTestClient();
  const { error } = await client.auth.signInWithPassword({
    email: process.env[`VITABLUE_RLS_${role.toUpperCase()}_EMAIL`],
    password: process.env[`VITABLUE_RLS_${role.toUpperCase()}_PASSWORD`],
  });
  if (error) throw new Error(`${role}: sign-in failed: ${error.message}`);
  clients[role] = client;
  return client;
}

function pass(label) { console.log(`PASS ${label}`); }
function assertSuccess(label, result) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  pass(label);
}
function assertDenied(label, result) {
  if (result.error || (Array.isArray(result.data) && result.data.length === 0)) {
    pass(label);
    return;
  }
  throw new Error(`${label}: operation unexpectedly succeeded`);
}

async function main() {
  const anonymous = createTestClient();
  const authenticated = {};
  for (const role of roles) authenticated[role] = await signIn(role);

  const campaign = {
    id: `${runId}-campaign`, name: 'RLS automated test', objective: 'test', status: 'draft',
    platforms: [], copies: {}, assets: [],
  };
  const profile = { platform: `${runId}-profile`, url: 'https://example.invalid/rls-test', username: 'rls-test' };

  try {
    await assertDenied('anonymous SELECT campaigns', await anonymous.from('marketing_campaigns').select('id').eq('id', campaign.id));
    await assertDenied('anonymous INSERT campaigns', await anonymous.from('marketing_campaigns').insert(campaign));
    assertSuccess('admin INSERT marker campaign', await authenticated.admin.from('marketing_campaigns').insert(campaign));
    assertSuccess('admin INSERT marker profile', await authenticated.admin.from('social_profiles').insert(profile));

    for (const role of roles) {
      assertSuccess(`${role} SELECT campaign`, await authenticated[role].from('marketing_campaigns').select('id').eq('id', campaign.id));
      assertSuccess(`${role} SELECT profile`, await authenticated[role].from('social_profiles').select('platform').eq('platform', profile.platform));
    }

    assertDenied('viewer UPDATE campaign', await authenticated.viewer.from('marketing_campaigns').update({ objective: 'viewer-must-not-update' }).eq('id', campaign.id).select('id'));
    assertDenied('viewer DELETE campaign', await authenticated.viewer.from('marketing_campaigns').delete().eq('id', campaign.id).select('id'));
    assertSuccess('editor UPDATE campaign', await authenticated.editor.from('marketing_campaigns').update({ objective: 'editor-update-ok' }).eq('id', campaign.id).select('id'));
    assertDenied('editor DELETE campaign', await authenticated.editor.from('marketing_campaigns').delete().eq('id', campaign.id).select('id'));
    assertSuccess('admin UPDATE campaign', await authenticated.admin.from('marketing_campaigns').update({ objective: 'admin-update-ok' }).eq('id', campaign.id).select('id'));

    const viewerInsert = await authenticated.viewer.from('marketing_campaigns').insert({ ...campaign, id: `${runId}-viewer` }).select('id');
    assertDenied('viewer INSERT campaign', viewerInsert);
    const editorInsert = await authenticated.editor.from('marketing_campaigns').insert({ ...campaign, id: `${runId}-editor` }).select('id');
    assertSuccess('editor INSERT campaign', editorInsert);

    assertSuccess('admin DELETE campaign markers', await authenticated.admin.from('marketing_campaigns').delete().like('id', `${runId}%`));
    assertSuccess('admin DELETE profile marker', await authenticated.admin.from('social_profiles').delete().eq('platform', profile.platform));
    console.log('RLS matrix completed successfully.');
  } finally {
    await authenticated.admin.from('marketing_campaigns').delete().like('id', `${runId}%`);
    await authenticated.admin.from('social_profiles').delete().eq('platform', profile.platform);
    for (const client of Object.values(clients)) await client.auth.signOut();
  }
}

main().catch((error) => {
  console.error(`RLS matrix failed: ${error.message}`);
  process.exit(1);
});
