namespace aiming {

    export class AimingLine {

        color: number
        fromSprite: Sprite
        towardsSprite: Sprite

        public constructor(fromSprite: Sprite, towardsSprite: Sprite, color: number) {
            this.fromSprite = fromSprite
            this.towardsSprite = towardsSprite
            this.color = color
        }

    }

    let aimingLines: AimingLine[] = []
    let initialized = false

    function findInExisting(fromSprite: Sprite, towardsSprite: Sprite): AimingLine {
        for (let aimingLine of aimingLines) {
            if (fromSprite == aimingLine.fromSprite
                && towardsSprite == aimingLine.towardsSprite) {
                return aimingLine
            }
        }
        return null
    }

    function findDots(x0: number, y0: number, x1: number, y1: number): { x: number, y: number }[] {
        let result: { x: number, y: number }[] = []

        let distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2))
        let yStep = (y1 - y0) / distance
        let xStep = (x1 - x0) / distance

        let x = x0, y = y0
        while (0 < x && x < 160 && 0 < y && y < 120) {
            result.push({ x: x, y: y })
            x += 5 * xStep
            y += 5 * yStep
        }

        return result
    }

    //%blockid=customcreateaimingline block="画出从 %fromSprite=variables_get(fromSprite) 到 %towardsSprite=variables_get(towardsSprite) 的瞄准线"
    //% blockSetVariable=aimingLine
    export function createAimingLine(fromSprite: Sprite, towardsSprite: Sprite): AimingLine {
        let aimingLine = findInExisting(fromSprite, towardsSprite)
        if (aimingLine != null) {
            return aimingLine
        }

        aimingLine = new AimingLine(fromSprite, towardsSprite, 1)
        aimingLines.push(aimingLine)
        if (!initialized) {
            game.onShade(() => {
                let canvas = image.create(160, 120)
                let camera = game.currentScene().camera
                for (let aimingLine of aimingLines) {
                    let fromSprite = aimingLine.fromSprite
                    let towardsSprite = aimingLine.towardsSprite
                    for (let point of findDots(fromSprite.x - camera.offsetX, fromSprite.y - camera.offsetY,
                        towardsSprite.x - camera.offsetX, towardsSprite.y - camera.offsetY)) {
                        canvas.setPixel(point.x, point.y, aimingLine.color)
                    }

                    // canvas.drawLine(fromSprite.x - camera.offsetX, fromSprite.y - camera.offsetY,
                    //     towardsSprite.x - camera.offsetX, towardsSprite.y - camera.offsetY, aimingLine.color)
                    screen.drawTransparentImage(canvas, 0, 0)
                }
            })
            initialized = true
        }

        return aimingLine
    }

    //%blockid=customdestoryaimingline block="消除瞄准线 %aimingLine=variables_get(aimingLine)"
    export function destroy(aimingLine: AimingLine) {
        aimingLines.removeElement(aimingLine)
        console.log(aimingLines.length)
    }

}