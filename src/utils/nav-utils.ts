import type { NavBarDropdownItem } from "../types/config";

export type NavBarDropdownGroup = {
	group?: string;
	items: NavBarDropdownItem[];
};

/** ドロップダウン項目を、連続する同じ group ごとにまとめる */
export function groupDropdownItems(
	items: NavBarDropdownItem[],
): NavBarDropdownGroup[] {
	const groups: NavBarDropdownGroup[] = [];
	for (const item of items) {
		const last = groups.at(-1);
		if (last && last.group === item.group) {
			last.items.push(item);
		} else {
			groups.push({ group: item.group, items: [item] });
		}
	}
	return groups;
}
