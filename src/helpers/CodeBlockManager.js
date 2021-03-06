import CodeBlock from './CodeBlock.js';
import blockData from './blockData.json';

export default class CodeBlockManager {
    constructor(scene) {
        this.scene = scene;
        this.blockData = blockData;

        this.startBlock = new CodeBlock(this.scene, this.blockData.blockData.Misc.startGame, this.blockData.blockShapes, this).setOrigin(0,0).setScale(6);
        //console.log(this);
        //const blockTypes = this.blockData.blockData;
        this.currentBlocks = [];
        this.boardBlocks = [];
        this.setToolbar('Movement');
        //this.currentToolBar = 'Movement';
    }

    removeFromBoard(blockID) {
        this.boardBlocks.splice(this.boardBlocks.findIndex( (block) => {
            return block.id === blockID;
        }), 1);
    }

    setToolbar(newToolBar) {
        this.currentToolBar = newToolBar;
        this.displayToolbarBlocks();
    }

    clearBlocks() {
        for (const block of this.currentBlocks.filter(block => !block.onBoard)) {
            block.clearResources();
        }
        this.currentBlocks.length = 0;
    }

    displayToolbarBlocks() {
        this.clearBlocks();
        const currentBlocksData = this.blockData.blockData[this.currentToolBar];
        for (const blockName of Object.keys(currentBlocksData)) {
            const blockData = currentBlocksData[blockName];
            this.currentBlocks.push(new CodeBlock(this.scene, blockData, this.blockData.blockShapes, this).setOrigin(0,0).setScale(6));
            //console.log(blockData);
        }
    }

    update(time, delta) {
        this.startBlock.update(time, delta);
        //console.log(this.startBlock);
        for (const codeBlock of this.currentBlocks) {
            codeBlock.update(time, delta);
        }
        for (const codeBlock of this.boardBlocks) {
            codeBlock.update(time, delta);
        }
        //console.log(this.boardBlocks);
    }

    allBlocks() {
        return this.currentBlocks.concat(this.boardBlocks);
    }

    getCost() {
        return this.boardBlocks.reduce((acc, cur) => {
            return acc * cur.cost;
        }, 1);
    }
}