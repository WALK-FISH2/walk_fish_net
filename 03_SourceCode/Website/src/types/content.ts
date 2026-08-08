export interface ArticleSummary {
  kind: "article";
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  updatedDate?: string;
  featured: boolean;
  tags: string[];
  readingTime: number;
}

export type ProgramStatus = "completed" | "in-progress" | "prototype" | "archived";

export type DemoType =
  | "static-embedded"
  | "external-live"
  | "video"
  | "gif"
  | "screenshots"
  | "none";

export interface ProgramPrivacy {
  storesData: "none" | "local-only" | "external";
  sendsDataExternally: boolean;
  externalServices: string[];
}

export type ProgramPlatformKind = "web" | "wechat-mini-program";

export interface ProgramPlatformSummary {
  kind: ProgramPlatformKind;
  label: string;
}

export type ProgramPlatform =
  | {
      kind: "web";
      label: string;
      url: string;
    }
  | {
      kind: "wechat-mini-program";
      label: string;
      qrImage: string;
      description: string;
      alt: string;
    };

export type ProgramMediaOrientation = "portrait" | "landscape";

export type ProgramMedia =
  | {
      type: "video";
      src: string;
      poster?: string;
      orientation: ProgramMediaOrientation;
      caption: string;
    }
  | {
      type: "gif" | "screenshot";
      src: string;
      orientation: ProgramMediaOrientation;
      alt: string;
      caption?: string;
    };

export interface ProgramSummary {
  kind: "program";
  slug: string;
  title: string;
  description: string;
  summary: string;
  status: ProgramStatus;
  category: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  order: number;
  stack: string[];
  tags: string[];
  demoType: DemoType;
  demoUrl?: string;
  sourceUrl?: string;
  platforms: ProgramPlatformSummary[];
  ownerContribution: string[];
  limitations: string[];
  privacy: ProgramPrivacy;
  whatItIs: string;
  whyBuilt: string;
  coreFeatures: string[];
  technicalApproach: string[];
  demoDescription?: string;
}

export interface ProgramDetail extends ProgramSummary {
  platforms: ProgramPlatform[];
  media: ProgramMedia[];
}

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  completed: "已完成",
  "in-progress": "进行中",
  prototype: "原型",
  archived: "已归档",
};

export const DEMO_TYPE_LABELS: Record<DemoType, string> = {
  "static-embedded": "静态前端演示",
  "external-live": "在线程序",
  video: "视频演示",
  gif: "GIF 演示",
  screenshots: "截图演示",
  none: "暂无演示",
};

export const PROGRAM_PLATFORM_LABELS: Record<ProgramPlatformKind, string> = {
  web: "网页版",
  "wechat-mini-program": "微信小程序",
};
