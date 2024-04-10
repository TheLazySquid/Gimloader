import type { ReactElement } from "react";
import type { IModalOptions } from "../types";
export default function showModal(content: HTMLElement | ReactElement, options?: Partial<IModalOptions>): () => void;
