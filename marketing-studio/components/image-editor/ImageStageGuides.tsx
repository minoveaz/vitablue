import React from 'react';
import type { ImageProject, ImagePreviewMode, CarouselGeometry, CanvasGuideSettings } from '../../types/imageStudio';
import type { PlatformGuideProfile } from '../../utils/imageDesignSystem';

interface ImageStageGuidesProps {
  project: ImageProject;
  previewMode: ImagePreviewMode;
  zoom: number;
  showGuideOverlay: boolean;
  isCarousel: boolean;
  activeSlideIndex: number;
  carouselGeometry: CarouselGeometry;
  guideSettings: CanvasGuideSettings;
  guideProfile: PlatformGuideProfile;
}

export const ImageStageGuides: React.FC<ImageStageGuidesProps> = ({ project, previewMode, zoom, showGuideOverlay, isCarousel, activeSlideIndex, carouselGeometry, guideSettings, guideProfile }) => (
  <>
          {/* CAROUSEL SLIDE GUIDES & BADGES */}
          {isCarousel && (() => {
            const { slideCount, slideWidth: slideW, slideHeight: slideH } = carouselGeometry;
            const isInstagram = project.preset.carouselPlatform === 'instagram' || project.preset.id.includes('instagram');
            const isTikTok = project.preset.carouselPlatform === 'tiktok' || project.preset.id.includes('tiktok');
            const isLinkedIn = project.preset.carouselPlatform === 'linkedin' || project.preset.id.includes('linkedin');

            return (
              <div
                data-editor-overlay="true"
                className="pointer-events-none absolute inset-0 z-30 overflow-visible select-none"
                aria-hidden="true"
              >
                {Array.from({ length: slideCount }, (_, idx) => {
                  const leftPos = idx * slideW;
                  const roleLabel = idx === 0 ? 'Portada / Hook' : idx === slideCount - 1 ? 'Cierre / CTA' : `Slide ${idx + 1}`;
                  const isFirst = idx === 0;
                  const isActive = idx === activeSlideIndex;

                  return (
                    <React.Fragment key={`slide-guide-${idx}`}>
                      {/* Top Header Badge */}
                      {(showGuideOverlay || previewMode !== 'normal') &&
                        (previewMode !== 'focus' || isActive) && (
                          <div
                            className={`absolute -top-7 flex items-center gap-1.5 rounded-t-md border-t border-x px-2.5 py-1 backdrop-blur-xs transition-all ${
                              isActive
                                ? 'border-brand-cyan/80 bg-primary/80 text-white'
                                : 'border-slate-700/60 bg-slate-900/75'
                            }`}
                            style={{
                              left: `${leftPos + 8}px`,
                              transform: `scale(${1 / Math.max(zoom, 0.25)})`,
                              transformOrigin: 'bottom left',
                            }}
                          >
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-cyan/20 text-[9px] font-mono font-black text-brand-cyan">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-slate-200">
                              {roleLabel}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              ({slideW}×{carouselGeometry.slideHeight})
                            </span>
                          </div>
                        )}

                      {/* Vertical Divider (between slides) */}
                      {idx > 0 && (showGuideOverlay || previewMode !== 'normal') && (
                        <div
                          className="absolute inset-y-0 w-0 border-l border-dashed border-slate-500/70"
                          style={{ left: `${leftPos}px` }}
                        >
                          <div className="absolute top-1/2 -left-3 -translate-y-1/2 rounded-full border border-slate-600 bg-slate-950 px-1.5 py-0.5 text-[8px] font-mono font-bold text-slate-400">
                            ✂
                          </div>
                        </div>
                      )}

                      {/* PLATFORM SPECIFIC OVERLAYS WHEN SAFE ZONE ENABLED */}
                      {(showGuideOverlay || previewMode === 'focus') && (
                        <div
                          className="pointer-events-none absolute inset-y-0"
                          style={{ left: `${leftPos}px`, width: `${slideW}px` }}
                        >
                          {previewMode === 'focus' && !isActive && (
                            <div className="absolute inset-0 bg-slate-950/55" />
                          )}
                          {previewMode === 'focus' && isActive && (
                            <div className="absolute inset-0 border-2 border-brand-cyan/80 shadow-[inset_0_0_0_1px_rgba(148,210,189,0.25)]" />
                          )}
                          {showGuideOverlay && guideSettings.showGrid && (
                            <div
                              className="absolute inset-0 opacity-15"
                              style={{
                                backgroundImage:
                                  'linear-gradient(to right, #94D2BD 1px, transparent 1px), linear-gradient(to bottom, #94D2BD 1px, transparent 1px)',
                                backgroundSize: '24px 24px',
                              }}
                            />
                          )}
                          {showGuideOverlay && guideSettings.showColumns && (
                            <div
                              className="absolute flex"
                              style={{
                                left: guideProfile.margins.left,
                                right: guideProfile.margins.right,
                                top: guideProfile.margins.top,
                                bottom: guideProfile.margins.bottom,
                                gap: guideSettings.columnGap,
                              }}
                            >
                              {Array.from({ length: guideSettings.columns }, (_, index) => (
                                <div
                                  key={index}
                                  className="h-full flex-1 border-x border-brand-cyan/20 bg-brand-cyan/[0.025]"
                                />
                              ))}
                            </div>
                          )}
                          {showGuideOverlay && guideSettings.showMargins && (
                            <div
                              className="absolute border border-dashed border-brand-cyan/45"
                              style={{
                                left: guideProfile.margins.left,
                                right: guideProfile.margins.right,
                                top: guideProfile.margins.top,
                                bottom: guideProfile.margins.bottom,
                              }}
                            />
                          )}
                          {showGuideOverlay && guideSettings.showRulers && (
                            <>
                              <div
                                className="absolute inset-x-0 top-0 flex h-6 items-end justify-between border-b border-brand-cyan/35 bg-slate-950/45 px-1 font-mono text-[9px] font-bold text-brand-cyan/80"
                                style={{
                                  transform: `scale(${1 / Math.max(zoom, 0.25)})`,
                                  transformOrigin: 'top left',
                                  width: `${Math.max(zoom, 0.25) * 100}%`,
                                }}
                              >
                                {Array.from({ length: 6 }, (_, index) => (
                                  <span key={index} className="border-l border-brand-cyan/35 pl-1">
                                    {Math.round((slideW / 5) * index)}
                                  </span>
                                ))}
                              </div>
                              <div
                                className="absolute inset-y-0 left-0 flex w-8 flex-col justify-between border-r border-brand-cyan/35 bg-slate-950/45 py-1 font-mono text-[8px] font-bold text-brand-cyan/80"
                                style={{
                                  transform: `scale(${1 / Math.max(zoom, 0.25)})`,
                                  transformOrigin: 'top left',
                                  height: `${Math.max(zoom, 0.25) * 100}%`,
                                }}
                              >
                                {Array.from({ length: 6 }, (_, index) => (
                                  <span key={index} className="border-t border-brand-cyan/35 pt-0.5">
                                    {Math.round((slideH / 5) * index)}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                          {/* Carousel safe zones are local to each slide, not the panorama. */}
                          {showGuideOverlay && guideSettings.showSafeZone && <div
                            className="absolute border-2 border-dashed border-amber-400/80 bg-amber-400/[0.03]"
                            style={{
                              left: `${guideProfile.safeInsets.left}px`,
                              right: `${guideProfile.safeInsets.right}px`,
                              top: `${guideProfile.safeInsets.top}px`,
                              bottom: `${guideProfile.safeInsets.bottom}px`,
                            }}
                          >
                            <span className="absolute -top-5 left-0 rounded bg-slate-950/85 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                              Zona segura {project.preset.aspectRatio}
                            </span>
                          </div>}
                          {/* 1:1 Profile Grid Crop Preview on Slide 1 for Instagram */}
                          {showGuideOverlay && isInstagram && isFirst && (
                            <div
                              className="absolute inset-x-0 border-2 border-dotted border-brand-cyan/80 bg-brand-cyan/[0.04]"
                              style={{
                                top: `${(slideH - slideW) / 2}px`,
                                height: `${slideW}px`,
                              }}
                            >
                              <span className="absolute bottom-1 right-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-[9px] font-bold text-brand-cyan">
                                Recorte perfil 1:1
                              </span>
                            </div>
                          )}

                          {/* TikTok Photo Mode UI Simulator Hints */}
                          {isTikTok && (
                            <>
                              {/* Right interaction bar hint */}
                              <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3 rounded-full bg-slate-950/60 p-1.5 text-[10px] text-white/50">
                                <span>❤️</span>
                                <span>💬</span>
                                <span>🔖</span>
                                <span>↗️</span>
                              </div>
                              {/* Bottom caption safe area */}
                              <div className="absolute inset-x-0 bottom-0 h-24 border-t border-dashed border-red-400/50 bg-red-400/10 px-3 py-2 text-[9px] text-red-300">
                                Safe Zone TikTok (Título, Audio & UI)
                              </div>
                            </>
                          )}

                          {/* LinkedIn Document Viewer Header hint */}
                          {isLinkedIn && (
                            <div className="absolute inset-x-0 top-0 h-10 border-b border-dashed border-blue-400/50 bg-blue-400/10 px-3 py-1.5 text-[9px] text-blue-200">
                              Barra Navegación Documento LinkedIn ({idx + 1} / {slideCount})
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                {showGuideOverlay &&
                  guideSettings.customVerticalGuides.map((percent) => (
                    <div
                      key={`panorama-v-${percent}`}
                      className="absolute inset-y-0 w-px bg-fuchsia-400/80"
                      style={{ left: `${percent}%` }}
                    />
                  ))}
                {showGuideOverlay &&
                  guideSettings.customHorizontalGuides.map((percent) => (
                    <div
                      key={`panorama-h-${percent}`}
                      className="absolute inset-x-0 h-px bg-fuchsia-400/80"
                      style={{ top: `${percent}%` }}
                    />
                  ))}
              </div>
            );
          })()}

          {/* PROFESSIONAL DESIGN GUIDES */}
          {showGuideOverlay && !isCarousel && (
            <div
              data-editor-overlay="true"
              className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
              aria-hidden="true"
            >
              {guideSettings.showGrid && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #94D2BD 1px, transparent 1px), linear-gradient(to bottom, #94D2BD 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}
              {guideSettings.showColumns && (
                <div
                  className="absolute flex"
                  style={{
                    left: guideProfile.margins.left,
                    right: guideProfile.margins.right,
                    top: guideProfile.margins.top,
                    bottom: guideProfile.margins.bottom,
                    gap: guideSettings.columnGap,
                  }}
                >
                  {Array.from({ length: guideSettings.columns }, (_, index) => (
                    <div
                      key={index}
                      className="h-full flex-1 border-x border-brand-cyan/30 bg-brand-cyan/5"
                    />
                  ))}
                </div>
              )}
              {guideSettings.showMargins && (
                <div
                  className="absolute border border-dashed border-brand-cyan/70"
                  style={{
                    left: guideProfile.margins.left,
                    right: guideProfile.margins.right,
                    top: guideProfile.margins.top,
                    bottom: guideProfile.margins.bottom,
                  }}
                />
              )}
              {guideSettings.showSafeZone && !project.preset.isCarousel && (
                <div
                  className="absolute border-2 border-dashed border-amber-400/80 bg-amber-400/[0.03]"
                  style={{
                    left: guideProfile.safeInsets.left,
                    right: guideProfile.safeInsets.right,
                    top: guideProfile.safeInsets.top,
                    bottom: guideProfile.safeInsets.bottom,
                  }}
                >
                  <span className="absolute left-2 top-2 rounded bg-slate-950/85 px-2 py-1 font-mono text-[10px] font-bold text-amber-300">
                    Safe zone · {guideProfile.label}
                  </span>
                </div>
              )}
              {guideSettings.customVerticalGuides.map((percent) => (
                <div
                  key={`v-${percent}`}
                  className="absolute inset-y-0 w-px bg-fuchsia-400/80"
                  style={{ left: `${percent}%` }}
                />
              ))}
              {guideSettings.customHorizontalGuides.map((percent) => (
                <div
                  key={`h-${percent}`}
                  className="absolute inset-x-0 h-px bg-fuchsia-400/80"
                  style={{ top: `${percent}%` }}
                />
              ))}
              {guideSettings.showRulers && (
                <>
                  <div
                    className="absolute inset-x-0 top-0 flex h-6 items-end justify-between border-b border-brand-cyan/60 bg-slate-950/80 px-1 font-mono text-[9px] font-bold text-brand-cyan"
                    style={{
                      transform: `scale(${1 / Math.max(zoom, 0.25)})`,
                      transformOrigin: 'top left',
                      width: `${Math.max(zoom, 0.25) * 100}%`,
                    }}
                  >
                    {Array.from({ length: 11 }, (_, index) => (
                      <span key={index} className="border-l border-brand-cyan/60 pl-1">
                        {Math.round((project.preset.width / 10) * index)}
                      </span>
                    ))}
                  </div>
                  <div
                    className="absolute inset-y-0 left-0 flex w-8 flex-col justify-between border-r border-brand-cyan/60 bg-slate-950/80 py-1 font-mono text-[8px] font-bold text-brand-cyan"
                    style={{
                      transform: `scale(${1 / Math.max(zoom, 0.25)})`,
                      transformOrigin: 'top left',
                      height: `${Math.max(zoom, 0.25) * 100}%`,
                    }}
                  >
                    {Array.from({ length: 11 }, (_, index) => (
                      <span key={index} className="border-t border-brand-cyan/60 pt-0.5">
                        {Math.round((project.preset.height / 10) * index)}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}


  </>
);
