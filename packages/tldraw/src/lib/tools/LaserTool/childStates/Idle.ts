import { StateNode, TLEventHandlers } from '@tldraw/editor'

export class Idle extends StateNode {
	static override id = 'idle'

	override onPointerDown: TLEventHandlers['onPointerDown'] = () => {
		this.parent.transition('lasering', { scribbles: [] })
	}
}
