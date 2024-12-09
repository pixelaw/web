import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import type { BigNumberish } from 'starknet';

type RemoveFieldOrder<T> = T extends object
  ? Omit<
      {
        [K in keyof T]: T[K] extends object ? RemoveFieldOrder<T[K]> : T[K];
      },
      'fieldOrder'
    >
  : T;
// Type definition for `pixelaw::core::models::registry::App` struct
export interface App {
	fieldOrder: string[];
	system: string;
	name: BigNumberish;
	icon: BigNumberish;
	action: BigNumberish;
}
export type InputApp = RemoveFieldOrder<App>;

// Type definition for `pixelaw::core::models::registry::AppValue` struct
export interface AppValue {
	fieldOrder: string[];
	name: BigNumberish;
	icon: BigNumberish;
	action: BigNumberish;
}
export type InputAppValue = RemoveFieldOrder<AppValue>;

// Type definition for `pixelaw::core::models::registry::AppName` struct
export interface AppName {
	fieldOrder: string[];
	name: BigNumberish;
	system: string;
}
export type InputAppName = RemoveFieldOrder<AppName>;

// Type definition for `pixelaw::core::models::registry::AppNameValue` struct
export interface AppNameValue {
	fieldOrder: string[];
	system: string;
}
export type InputAppNameValue = RemoveFieldOrder<AppNameValue>;

// Type definition for `pixelaw::core::models::registry::AppUser` struct
export interface AppUser {
	fieldOrder: string[];
	system: string;
	player: string;
	action: BigNumberish;
}
export type InputAppUser = RemoveFieldOrder<AppUser>;

// Type definition for `pixelaw::core::models::registry::AppUserValue` struct
export interface AppUserValue {
	fieldOrder: string[];
	action: BigNumberish;
}
export type InputAppUserValue = RemoveFieldOrder<AppUserValue>;

// Type definition for `pixelaw::core::models::area::AreaValue` struct
export interface AreaValue {
	fieldOrder: string[];
	app: string;
	owner: string;
	color: BigNumberish;
}
export type InputAreaValue = RemoveFieldOrder<AreaValue>;

// Type definition for `pixelaw::core::models::area::Area` struct
export interface Area {
	fieldOrder: string[];
	id: BigNumberish;
	app: string;
	owner: string;
	color: BigNumberish;
}
export type InputArea = RemoveFieldOrder<Area>;

// Type definition for `pixelaw::core::models::registry::CoreActionsAddress` struct
export interface CoreActionsAddress {
	fieldOrder: string[];
	key: BigNumberish;
	value: string;
}
export type InputCoreActionsAddress = RemoveFieldOrder<CoreActionsAddress>;

// Type definition for `pixelaw::core::models::registry::CoreActionsAddressValue` struct
export interface CoreActionsAddressValue {
	fieldOrder: string[];
	value: string;
}
export type InputCoreActionsAddressValue = RemoveFieldOrder<CoreActionsAddressValue>;

// Type definition for `pixelaw::core::models::pixel::Pixel` struct
export interface Pixel {
	fieldOrder: string[];
	x: BigNumberish;
	y: BigNumberish;
	app: string;
	color: BigNumberish;
	created_at: BigNumberish;
	updated_at: BigNumberish;
	timestamp: BigNumberish;
	owner: string;
	text: BigNumberish;
	action: BigNumberish;
}
export type InputPixel = RemoveFieldOrder<Pixel>;

// Type definition for `pixelaw::core::models::pixel::PixelValue` struct
export interface PixelValue {
	fieldOrder: string[];
	app: string;
	color: BigNumberish;
	created_at: BigNumberish;
	updated_at: BigNumberish;
	timestamp: BigNumberish;
	owner: string;
	text: BigNumberish;
	action: BigNumberish;
}
export type InputPixelValue = RemoveFieldOrder<PixelValue>;

// Type definition for `pixelaw::core::models::queue::QueueItem` struct
export interface QueueItem {
	fieldOrder: string[];
	id: BigNumberish;
	valid: boolean;
}
export type InputQueueItem = RemoveFieldOrder<QueueItem>;

// Type definition for `pixelaw::core::models::queue::QueueItemValue` struct
export interface QueueItemValue {
	fieldOrder: string[];
	valid: boolean;
}
export type InputQueueItemValue = RemoveFieldOrder<QueueItemValue>;

// Type definition for `pixelaw::core::models::area::RTree` struct
export interface RTree {
	fieldOrder: string[];
	id: BigNumberish;
	children: BigNumberish;
}
export type InputRTree = RemoveFieldOrder<RTree>;

// Type definition for `pixelaw::core::models::area::RTreeValue` struct
export interface RTreeValue {
	fieldOrder: string[];
	children: BigNumberish;
}
export type InputRTreeValue = RemoveFieldOrder<RTreeValue>;

// Type definition for `pixelaw::apps::snake::app::Snake` struct
export interface Snake {
	fieldOrder: string[];
	owner: string;
	length: BigNumberish;
	first_segment_id: BigNumberish;
	last_segment_id: BigNumberish;
	direction: Direction;
	color: BigNumberish;
	text: BigNumberish;
	is_dying: boolean;
}
export type InputSnake = RemoveFieldOrder<Snake>;

// Type definition for `pixelaw::apps::snake::app::SnakeValue` struct
export interface SnakeValue {
	fieldOrder: string[];
	length: BigNumberish;
	first_segment_id: BigNumberish;
	last_segment_id: BigNumberish;
	direction: Direction;
	color: BigNumberish;
	text: BigNumberish;
	is_dying: boolean;
}
export type InputSnakeValue = RemoveFieldOrder<SnakeValue>;

// Type definition for `pixelaw::apps::snake::app::SnakeSegmentValue` struct
export interface SnakeSegmentValue {
	fieldOrder: string[];
	previous_id: BigNumberish;
	next_id: BigNumberish;
	x: BigNumberish;
	y: BigNumberish;
	pixel_original_color: BigNumberish;
	pixel_original_text: BigNumberish;
	pixel_original_app: string;
}
export type InputSnakeSegmentValue = RemoveFieldOrder<SnakeSegmentValue>;

// Type definition for `pixelaw::apps::snake::app::SnakeSegment` struct
export interface SnakeSegment {
	fieldOrder: string[];
	id: BigNumberish;
	previous_id: BigNumberish;
	next_id: BigNumberish;
	x: BigNumberish;
	y: BigNumberish;
	pixel_original_color: BigNumberish;
	pixel_original_text: BigNumberish;
	pixel_original_app: string;
}
export type InputSnakeSegment = RemoveFieldOrder<SnakeSegment>;

// Type definition for `pixelaw::core::utils::Direction` enum
export enum Direction {
	None,
	Left,
	Right,
	Up,
	Down,
}

export interface SchemaType extends ISchemaType {
	pixelaw: {
		App: App,
		AppValue: AppValue,
		AppName: AppName,
		AppNameValue: AppNameValue,
		AppUser: AppUser,
		AppUserValue: AppUserValue,
		AreaValue: AreaValue,
		Area: Area,
		CoreActionsAddress: CoreActionsAddress,
		CoreActionsAddressValue: CoreActionsAddressValue,
		Pixel: Pixel,
		PixelValue: PixelValue,
		QueueItem: QueueItem,
		QueueItemValue: QueueItemValue,
		RTree: RTree,
		RTreeValue: RTreeValue,
		Snake: Snake,
		SnakeValue: SnakeValue,
		SnakeSegmentValue: SnakeSegmentValue,
		SnakeSegment: SnakeSegment,
	},
}
export const schema: SchemaType = {
	pixelaw: {
		App: {
			fieldOrder: ['system', 'name', 'icon', 'action'],
			system: "",
			name: 0,
			icon: 0,
			action: 0,
		},
		AppValue: {
			fieldOrder: ['name', 'icon', 'action'],
			name: 0,
			icon: 0,
			action: 0,
		},
		AppName: {
			fieldOrder: ['name', 'system'],
			name: 0,
			system: "",
		},
		AppNameValue: {
			fieldOrder: ['system'],
			system: "",
		},
		AppUser: {
			fieldOrder: ['system', 'player', 'action'],
			system: "",
			player: "",
			action: 0,
		},
		AppUserValue: {
			fieldOrder: ['action'],
			action: 0,
		},
		AreaValue: {
			fieldOrder: ['app', 'owner', 'color'],
			app: "",
			owner: "",
			color: 0,
		},
		Area: {
			fieldOrder: ['id', 'app', 'owner', 'color'],
			id: 0,
			app: "",
			owner: "",
			color: 0,
		},
		CoreActionsAddress: {
			fieldOrder: ['key', 'value'],
			key: 0,
			value: "",
		},
		CoreActionsAddressValue: {
			fieldOrder: ['value'],
			value: "",
		},
		Pixel: {
			fieldOrder: ['x', 'y', 'app', 'color', 'created_at', 'updated_at', 'timestamp', 'owner', 'text', 'action'],
			x: 0,
			y: 0,
			app: "",
			color: 0,
			created_at: 0,
			updated_at: 0,
			timestamp: 0,
			owner: "",
			text: 0,
			action: 0,
		},
		PixelValue: {
			fieldOrder: ['app', 'color', 'created_at', 'updated_at', 'timestamp', 'owner', 'text', 'action'],
			app: "",
			color: 0,
			created_at: 0,
			updated_at: 0,
			timestamp: 0,
			owner: "",
			text: 0,
			action: 0,
		},
		QueueItem: {
			fieldOrder: ['id', 'valid'],
			id: 0,
			valid: false,
		},
		QueueItemValue: {
			fieldOrder: ['valid'],
			valid: false,
		},
		RTree: {
			fieldOrder: ['id', 'children'],
			id: 0,
			children: 0,
		},
		RTreeValue: {
			fieldOrder: ['children'],
			children: 0,
		},
		Snake: {
			fieldOrder: ['owner', 'length', 'first_segment_id', 'last_segment_id', 'direction', 'color', 'text', 'is_dying'],
			owner: "",
			length: 0,
			first_segment_id: 0,
			last_segment_id: 0,
			direction: Direction.None,
			color: 0,
			text: 0,
			is_dying: false,
		},
		SnakeValue: {
			fieldOrder: ['length', 'first_segment_id', 'last_segment_id', 'direction', 'color', 'text', 'is_dying'],
			length: 0,
			first_segment_id: 0,
			last_segment_id: 0,
			direction: Direction.None,
			color: 0,
			text: 0,
			is_dying: false,
		},
		SnakeSegmentValue: {
			fieldOrder: ['previous_id', 'next_id', 'x', 'y', 'pixel_original_color', 'pixel_original_text', 'pixel_original_app'],
			previous_id: 0,
			next_id: 0,
			x: 0,
			y: 0,
			pixel_original_color: 0,
			pixel_original_text: 0,
			pixel_original_app: "",
		},
		SnakeSegment: {
			fieldOrder: ['id', 'previous_id', 'next_id', 'x', 'y', 'pixel_original_color', 'pixel_original_text', 'pixel_original_app'],
			id: 0,
			previous_id: 0,
			next_id: 0,
			x: 0,
			y: 0,
			pixel_original_color: 0,
			pixel_original_text: 0,
			pixel_original_app: "",
		},
	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}