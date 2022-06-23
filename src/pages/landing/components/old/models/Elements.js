import { constants } from "../utils/constants";


class ElementModel {
    constructor({name, code, tileMap, item, src, isBuilder, curPosition, worldSize, gridLevel}) {
        this.worldSize = worldSize
        this.name = name;
        this.code = code;
        this.src = src;
        this.item = item;
        this.tileMap = tileMap;
        this.isBuilder = isBuilder;
        this.curPosition = curPosition;
        this.gridLevel = gridLevel;

        // console.table (this)
    }
    getName() {
        return this.name;
    }
    getEl() {
        return {
            name: this.name,
            code: this.code,
            src: this.src,
            item: this.item,
            tileMap: this.tileMap,
            gridLevel: this.gridLevel,
        };
    }

    getPosition() {
        // const yOffset =
        //     ((100 / constants?.WORLD_SIZE) * constants?.TILE_ASPECT_RATIO) / 2.65;
        const wBase = (100 / this.worldSize) * this.tileMap?.size;
        const xBase = 7.14286;
        const yBase = 6.2337;
        let t = this.tileMap?.position?.t || 0;
        let r = this.tileMap?.position?.r || 0;
        let zIndex = this.tileMap?.zIndex || 100;
        if (!this.isBuilder) {
            r = this.curPosition?.r;
            t = this.curPosition?.t;
            zIndex = this.curPosition?.z;
        }
        // const xAbs = Math.abs(xBase * (r + t + 1));
        // const yAbs = Math.abs(yBase * (t - r - 6));
        const xAbs = (100 / this.worldSize) * ((t+r) * 0.5)
        const yAbs = (100 / this.worldSize) * ((this.worldSize - (r-t) - 1) * 0.5)

        // console.log({xAbs, yAbs})

        return {
            left: xAbs,
            bottom: yAbs,
            // left: 0,
            // top: 0,
            wBase: wBase,
            zIndex: zIndex
        }
    }
}

export default ElementModel