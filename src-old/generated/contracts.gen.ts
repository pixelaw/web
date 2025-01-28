import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {

	const actions_init = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "init",
					calldata: [],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_canUpdatePixel = async (snAccount: Account | AccountInterface, forPlayer: string, forSystem: string, pixel: models.InputPixel, pixelUpdate: models.InputPixelUpdate, areaIdHint: models.CairoOption<BigNumberish>, allowModify: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "can_update_pixel",
					calldata: [forPlayer, forSystem, pixel, pixelUpdate, areaIdHint, allowModify],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_updatePixel = async (snAccount: Account | AccountInterface, forPlayer: string, forSystem: string, pixelUpdate: models.InputPixelUpdate, areaId: models.CairoOption<BigNumberish>, allowModify: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "update_pixel",
					calldata: [forPlayer, forSystem, pixelUpdate, areaId, allowModify],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_processQueue = async (snAccount: Account | AccountInterface, id: BigNumberish, timestamp: BigNumberish, calledSystem: string, selector: BigNumberish, calldata: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "process_queue",
					calldata: [id, timestamp, calledSystem, selector, calldata],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_scheduleQueue = async (snAccount: Account | AccountInterface, timestamp: BigNumberish, calledSystem: string, selector: BigNumberish, calldata: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "schedule_queue",
					calldata: [timestamp, calledSystem, selector, calldata],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_newApp = async (snAccount: Account | AccountInterface, system: string, name: BigNumberish, icon: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "new_app",
					calldata: [system, name, icon],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_alertPlayer = async (snAccount: Account | AccountInterface, position: models.InputPosition, player: string, message: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "alert_player",
					calldata: [position, player, message],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_addArea = async (snAccount: Account | AccountInterface, bounds: models.InputBounds, owner: string, color: BigNumberish, app: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "add_area",
					calldata: [bounds, owner, color, app],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_removeArea = async (snAccount: Account | AccountInterface, areaId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "remove_area",
					calldata: [areaId],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_findAreaByPosition = async (snAccount: Account | AccountInterface, position: models.InputPosition) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "find_area_by_position",
					calldata: [position],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const actions_findAreasInsideBounds = async (snAccount: Account | AccountInterface, bounds: models.InputBounds) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "actions",
					entrypoint: "find_areas_inside_bounds",
					calldata: [bounds],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const snake_actions_onPreUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.InputPixelUpdate, appCaller: models.InputApp, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "snake_actions",
					entrypoint: "on_pre_update",
					calldata: [pixelUpdate, appCaller, playerCaller],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const snake_actions_onPostUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.InputPixelUpdate, appCaller: models.InputApp, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "snake_actions",
					entrypoint: "on_post_update",
					calldata: [pixelUpdate, appCaller, playerCaller],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const snake_actions_init = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "snake_actions",
					entrypoint: "init",
					calldata: [],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const snake_actions_interact = async (snAccount: Account | AccountInterface, defaultParams: models.InputDefaultParameters, direction: models.Direction) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "snake_actions",
					entrypoint: "interact",
					calldata: [defaultParams, direction],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const snake_actions_move = async (snAccount: Account | AccountInterface, owner: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "snake_actions",
					entrypoint: "move",
					calldata: [owner],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_init = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "init",
					calldata: [],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_onPreUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.InputPixelUpdate, appCaller: models.InputApp, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "on_pre_update",
					calldata: [pixelUpdate, appCaller, playerCaller],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_onPostUpdate = async (snAccount: Account | AccountInterface, pixelUpdate: models.InputPixelUpdate, appCaller: models.InputApp, playerCaller: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "on_post_update",
					calldata: [pixelUpdate, appCaller, playerCaller],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_interact = async (snAccount: Account | AccountInterface, defaultParams: models.InputDefaultParameters) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "interact",
					calldata: [defaultParams],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_putColor = async (snAccount: Account | AccountInterface, defaultParams: models.InputDefaultParameters) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "put_color",
					calldata: [defaultParams],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_fade = async (snAccount: Account | AccountInterface, defaultParams: models.InputDefaultParameters) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "fade",
					calldata: [defaultParams],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const paint_actions_pixelRow = async (snAccount: Account | AccountInterface, defaultParams: models.InputDefaultParameters, imageData: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "paint_actions",
					entrypoint: "pixel_row",
					calldata: [defaultParams, imageData],
				},
				"pixelaw",
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		actions: {
			init: actions_init,
			canUpdatePixel: actions_canUpdatePixel,
			updatePixel: actions_updatePixel,
			processQueue: actions_processQueue,
			scheduleQueue: actions_scheduleQueue,
			newApp: actions_newApp,
			alertPlayer: actions_alertPlayer,
			addArea: actions_addArea,
			removeArea: actions_removeArea,
			findAreaByPosition: actions_findAreaByPosition,
			findAreasInsideBounds: actions_findAreasInsideBounds,
		},
		snake_actions: {
			onPreUpdate: snake_actions_onPreUpdate,
			onPostUpdate: snake_actions_onPostUpdate,
			init: snake_actions_init,
			interact: snake_actions_interact,
			move: snake_actions_move,
		},
		paint_actions: {
			init: paint_actions_init,
			onPreUpdate: paint_actions_onPreUpdate,
			onPostUpdate: paint_actions_onPostUpdate,
			interact: paint_actions_interact,
			putColor: paint_actions_putColor,
			fade: paint_actions_fade,
			pixelRow: paint_actions_pixelRow,
		},
	};
}