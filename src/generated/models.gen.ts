import type { SchemaType } from "@dojoengine/sdk";

// Type definition for `pixelaw::core::models::registry::App` struct
export interface App {
	fieldOrder: string[];
	system: string;
	name: number;
	icon: number;
	action: number;
}

// Type definition for `pixelaw::core::models::registry::AppName` struct
export interface AppName {
	fieldOrder: string[];
	name: number;
	system: string;
}

// Type definition for `pixelaw::core::models::registry::AppUser` struct
export interface AppUser {
	fieldOrder: string[];
	system: string;
	player: string;
	action: number;
}

// Type definition for `pixelaw::core::models::area::Area` struct
export interface Area {
	fieldOrder: string[];
	id: number;
	app: string;
	owner: string;
	color: number;
}

// Type definition for `pixelaw::core::models::registry::CoreActionsAddress` struct
export interface CoreActionsAddress {
	fieldOrder: string[];
	key: number;
	value: string;
}

// Type definition for `pixelaw::core::models::pixel::Pixel` struct
export interface Pixel {
	fieldOrder: string[];
	x: number;
	y: number;
	app: string;
	color: number;
	created_at: number;
	updated_at: number;
	timestamp: number;
	owner: string;
	text: number;
	action: number;
}

// Type definition for `pixelaw::core::models::queue::QueueItem` struct
export interface QueueItem {
	fieldOrder: string[];
	id: number;
	valid: boolean;
}

// Type definition for `pixelaw::core::models::area::RTree` struct
export interface RTree {
	fieldOrder: string[];
	id: number;
	children: number;
}

// Type definition for `pixelaw::apps::snake::app::Snake` struct
export interface Snake {
	fieldOrder: string[];
	owner: string;
	length: number;
	first_segment_id: number;
	last_segment_id: number;
	direction: Direction;
	color: number;
	text: number;
	is_dying: boolean;
}

// Type definition for `pixelaw::apps::snake::app::SnakeSegment` struct
export interface SnakeSegment {
	fieldOrder: string[];
	id: number;
	previous_id: number;
	next_id: number;
	x: number;
	y: number;
	pixel_original_color: number;
	pixel_original_text: number;
	pixel_original_app: string;
}

// Type definition for `pixelaw::core::utils::Direction` enum
export enum Direction {
	None,
	Left,
	Right,
	Up,
	Down,
}

export interface PixelawSchemaType extends SchemaType {
	pixelaw: {
		App: App,
		AppName: AppName,
		AppUser: AppUser,
		Area: Area,
		CoreActionsAddress: CoreActionsAddress,
		Pixel: Pixel,
		QueueItem: QueueItem,
		RTree: RTree,
		Snake: Snake,
		SnakeSegment: SnakeSegment,
		ERC__Balance: ERC__Balance,
		ERC__Token: ERC__Token,
		ERC__Transfer: ERC__Transfer,
	},
}
export const schema: PixelawSchemaType = {
	pixelaw: {
		App: {
			fieldOrder: ['system', 'name', 'icon', 'action'],
			system: "",
			name: 0,
			icon: 0,
			action: 0,
		},
		AppName: {
			fieldOrder: ['name', 'system'],
			name: 0,
			system: "",
		},
		AppUser: {
			fieldOrder: ['system', 'player', 'action'],
			system: "",
			player: "",
			action: 0,
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
		QueueItem: {
			fieldOrder: ['id', 'valid'],
			id: 0,
			valid: false,
		},
		RTree: {
			fieldOrder: ['id', 'children'],
			id: 0,
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
		ERC__Balance: {
			fieldOrder: ['balance', 'type', 'tokenmetadata'],
			balance: '',
			type: 'ERC20',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
		},
		ERC__Token: {
			fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
			name: '',
			symbol: '',
			tokenId: '',
			decimals: '',
			contractAddress: '',
		},
		ERC__Transfer: {
			fieldOrder: ['from', 'to', 'amount', 'type', 'executed', 'tokenMetadata'],
			from: '',
			to: '',
			amount: '',
			type: 'ERC20',
			executedAt: '',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
			transactionHash: '',
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