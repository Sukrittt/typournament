import { serverClient } from "~/trpc/server-client";
import { RequestSheet } from "./request-sheet";

export const Requests = async () => {
  const userRequests = await serverClient.request.getUserRequests();

  return <RequestSheet data={userRequests} />;
};