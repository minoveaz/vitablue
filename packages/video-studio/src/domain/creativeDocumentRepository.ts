import {
  creativeDocumentToVideoProject,
  videoProjectToCreativeDocument,
} from '../../../creative-document/src/adapters/videoProjectAdapter';
import type { CreativeDocumentRepository } from '../../../creative-document/src/repository';
import type { VideoProject, VideoProjectRepository } from './videoProject';

/**
 * Compatibility repository for Video Studio while its editor still owns the
 * legacy VideoProject shape. Persistence and optimistic versioning stay in the
 * neutral CreativeDocument repository.
 */
export const createVideoProjectRepositoryFromCreativeDocuments = (
  documents: CreativeDocumentRepository,
): VideoProjectRepository => ({
  async load(projectId) {
    const record = await documents.load(projectId);
    return record ? creativeDocumentToVideoProject(record.document) : null;
  },
  async save(project: VideoProject) {
    await documents.save(videoProjectToCreativeDocument(project));
  },
  async list() {
    const summaries = await documents.list();
    return summaries
      .filter((summary) => summary.mode === 'video' || summary.mode === 'mixed')
      .map(({ id, name, updatedAt }) => ({ id, name, updatedAt }));
  },
});
