import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {{

	const init = async (account: Account) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "init",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const onPreUpdate = async (account: Account, pixelUpdate: PixelUpdate, appCaller: App, playerCaller: string) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "on_pre_update",
					calldata: [pixelUpdate, appCaller, playerCaller],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const onPostUpdate = async (account: Account, pixelUpdate: PixelUpdate, appCaller: App, playerCaller: string) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "on_post_update",
					calldata: [pixelUpdate, appCaller, playerCaller],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const interact = async (account: Account, defaultParams: DefaultParameters) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "interact",
					calldata: [defaultParams],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const putColor = async (account: Account, defaultParams: DefaultParameters) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "put_color",
					calldata: [defaultParams],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const fade = async (account: Account, defaultParams: DefaultParameters) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "fade",
					calldata: [defaultParams],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const pixelRow = async (account: Account, defaultParams: DefaultParameters, imageData: Array<number>) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "pixel_row",
					calldata: [defaultParams, imageData],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const name = async (account: Account) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "paint_actions",
					entryPoint: "name",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const name = async (account: Account) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "snake_actions",
					entryPoint: "name",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const init = async (account: Account) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "snake_actions",
					entryPoint: "init",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const interact = async (account: Account, defaultParams: DefaultParameters, direction: models.Direction) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "snake_actions",
					entryPoint: "interact",
					calldata: [defaultParams, direction],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const move = async (account: Account, owner: string) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "snake_actions",
					entryPoint: "move",
					calldata: [owner],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const name = async (account: Account) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "name",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const init = async (account: Account) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "init",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const canUpdatePixel = async (account: Account, forPlayer: string, forSystem: string, pixel: Pixel, pixelUpdate: PixelUpdate, areaIdHint: models.Option, allowModify: boolean) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "can_update_pixel",
					calldata: [forPlayer, forSystem, pixel, pixelUpdate, areaIdHint, allowModify],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const updatePixel = async (account: Account, forPlayer: string, forSystem: string, pixelUpdate: PixelUpdate, areaId: models.Option, allowModify: boolean) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "update_pixel",
					calldata: [forPlayer, forSystem, pixelUpdate, areaId, allowModify],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const processQueue = async (account: Account, id: number, timestamp: number, calledSystem: string, selector: number, calldata: Array<number>) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "process_queue",
					calldata: [id, timestamp, calledSystem, selector, calldata],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const scheduleQueue = async (account: Account, timestamp: number, calledSystem: string, selector: number, calldata: Array<number>) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "schedule_queue",
					calldata: [timestamp, calledSystem, selector, calldata],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const newApp = async (account: Account, system: string, name: number, icon: number) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "new_app",
					calldata: [system, name, icon],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const alertPlayer = async (account: Account, position: Position, player: string, message: number) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "alert_player",
					calldata: [position, player, message],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const addArea = async (account: Account, bounds: Bounds, owner: string, color: number, app: string) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "add_area",
					calldata: [bounds, owner, color, app],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const removeArea = async (account: Account, areaId: number) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "remove_area",
					calldata: [areaId],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const findAreaByPosition = async (account: Account, position: Position) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "find_area_by_position",
					calldata: [position],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const findAreasInsideBounds = async (account: Account, bounds: Bounds) => {
		try {
			return await provider.execute(

				account,
				{
					contractName: "actions",
					entryPoint: "find_areas_inside_bounds",
					calldata: [bounds],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		init,
		onPreUpdate,
		onPostUpdate,
		interact,
		putColor,
		fade,
		pixelRow,
		name,
		name,
		init,
		interact,
		move,
		name,
		init,
		canUpdatePixel,
		updatePixel,
		processQueue,
		scheduleQueue,
		newApp,
		alertPlayer,
		addArea,
		removeArea,
		findAreaByPosition,
		findAreasInsideBounds,
	};
}