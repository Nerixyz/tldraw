import { StateNode, TLEventHandlers } from '@tldraw/editor'

export class Lasering extends StateNode {
	static override id = 'lasering'

	scribbleId = 'id'
	pastScribbles: string[] = []

	override onEnter = ({ scribbles }: { scribbles: string[] }) => {
		const startState = {
			color: 'laser',
			opacity: 0.7,
			size: 4,
			delay: 1200,
			shrink: 0.05,
			taper: true,
		} as const

		this.pastScribbles = this.editor.scribbles.restoreScribbles(scribbles, startState)

		const scribble = this.editor.scribbles.addScribble(startState)
		this.scribbleId = scribble.id
		this.pushPointToScribble()
	}

	override onExit = () => {
		this.editor.scribbles.stop(this.scribbleId)
		for (const id of this.pastScribbles) {
			this.editor.scribbles.stop(id)
		}
	}

	override onPointerMove = () => {
		this.pushPointToScribble()
	}

	override onPointerUp = () => {
		this.complete()
	}

	private pushPointToScribble = () => {
		const { x, y } = this.editor.inputs.currentPagePoint
		this.editor.scribbles.addPoint(this.scribbleId, x, y)
	}

	override onCancel: TLEventHandlers['onCancel'] = () => {
		this.cancel()
	}

	override onComplete: TLEventHandlers['onComplete'] = () => {
		this.complete()
	}

	private complete() {
		this.parent.transition('pending', { scribbles: [...this.pastScribbles, this.scribbleId] })
	}

	private cancel() {
		this.parent.transition('idle')
	}
}
