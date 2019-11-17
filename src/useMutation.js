import { h } from "preact";
import { useState, useRef, useMemo, useLayoutEffect } from "preact/hooks";

import { defaultClientManager } from "./client";
import MutationManager from "./mutationManager";

export default function useMutation(packet) {
  let [mutation, options = {}] = packet;
  let [mutationState, setMutationState] = useState(null);

  let client = options.client || defaultClientManager.getDefaultClient();

  let mutationManagerRef = useRef(null);
  if (!mutationManagerRef.current) {
    mutationManagerRef.current = new MutationManager(
      { client, setState: setMutationState },
      packet
    );
    mutationManagerRef.current.updateState();
  }

  useLayoutEffect(
    () => () => (mutationManagerRef.current.setState = () => {}),
    []
  );

  return mutationState || mutationManagerRef.current.currentState;
}
