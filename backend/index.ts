import controllerContainerDI from "./inversify/containerDI";
import { App } from "./server/serverApp";

async function bootstrap():Promise<void> {
	const app = controllerContainerDI.get<App>(App);

	await app.init();
}

export const boot = bootstrap();

