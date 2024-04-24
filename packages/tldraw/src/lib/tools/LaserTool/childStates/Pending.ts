import { StateNode, TLEventHandlers } from '@tldraw/editor'

export class Pending extends StateNode {
	static override id = 'pending'

	pastScribbles: string[] = []
	pendingTime = 0

	override onEnter = ({ scribbles }: { scribbles: string[] }) => {
		this.pastScribbles = scribbles
		this.pendingTime = 2000
	}

	override onPointerDown: TLEventHandlers['onPointerDown'] = () => {
		this.parent.transition('lasering', { scribbles: this.pastScribbles })
	}

	override onCancel: TLEventHandlers['onCancel'] = () => {
		this.cancel()
	}

	override onTick: TLEventHandlers['onTick'] = ({ elapsed }) => {
		this.pendingTime -= elapsed
		if (this.pendingTime < 0) {
			this.cancel()
		}
	}

	private cancel() {
		this.parent.transition('idle')
	}
}
