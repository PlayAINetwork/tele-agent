import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const ConvexServerProvider = ({ children }: { children: ReactNode }) => {
  const convex = new ConvexReactClient(import.meta.env.agentexperience.live);
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

export default ConvexServerProvider;
