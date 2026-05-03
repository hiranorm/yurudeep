import type {
	CommentConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "ゆるディープ",
	subtitle: "ゆるふわなディープラーニングブログ",
	lang: "ja",
	themeColor: {
		hue: 245,
		fixed: true,
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		{
			src: "/favicon/favicon-light-192.png",
			theme: "light",
			sizes: "192x192",
		},
		{
			src: "/favicon/favicon-dark-192.png",
			theme: "dark",
			sizes: "192x192",
		},
		{
			src: "/favicon/favicon-light-32.png",
			theme: "light",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-dark-32.png",
			theme: "dark",
			sizes: "32x32",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "Dojo",
			url: "/dojo/",
			external: false,
		},
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/hiranorm",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/assets/images/logo.png",
	name: "ひらノルム",
	bio: "京大大学院（工学・生物化学）修了。機械学習・AI・自動化についてゆるふわに書いています。親指シフト愛好家。\nKaggle Competitions Expert（銀2・銅4）／Notebooks Expert（金3・銀2・銅3）",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/hiranorm",
		},
		{
			name: "Kaggle",
			icon: "fa6-brands:kaggle",
			url: "https://www.kaggle.com/hiranorm",
		},
		{
			name: "X",
			icon: "fa6-brands:x-twitter",
			url: "https://x.com/hiranorm_dayo",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

// IDs are obtained from https://giscus.app after enabling Discussions and installing the Giscus app on hiranorm/yurudeep
export const commentConfig: CommentConfig = {
	enable: true,
	provider: "giscus",
	giscus: {
		repo: "hiranorm/yurudeep",
		repoId: "R_kgDOSArZWQ",
		category: "Announcements",
		categoryId: "DIC_kwDOSArZWc4C8Ods",
		mapping: "pathname",
		theme: "cobalt",
		lang: "ja",
		reactionsEnabled: "1",
		inputPosition: "bottom",
	},
};
