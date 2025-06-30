import { Client } from "../classes/Client";
export default function defaultEventsSetup(client: Client): void {
    client.on("connect", () => {
        client.logger.log("Connected to the server as", client._client.socket._host);
    });
    if (client.options.chatLog) {
        client.on("chatColorized", (colorizedMsg: string) => {
            client.logger.log(colorizedMsg);
        });
    }
    client.on("error", (err: Error) => {
        client.logger.error("An error occurred:", err);
    });

    client.on("end", (reason: string) => {
        client.logger.warn("Disconnected:", reason);
    });

    client.on("kicked", (reason: any) => {
        console.dir(reason.value || reason, { depth: null });
    });
}