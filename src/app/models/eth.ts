export class Eth {
    public x = 0;
    public y = -100.0;
    public transaction: any;
    public width = 100;
    public height = 100;
    private speed;
    private eth = new Image();
    private ethXSSrc = '../../assets/Images/eth_xs.png';
    private ethSmallSrc = '../../assets/Images/eth_small.png';
    private ethMedSrc = '../../assets/Images/eth_medium.png';
    private ethLargeSrc = '../../assets/Images/eth_large.png';
    private ethXLSrc = '../../assets/Images/eth_xl.png';
    private ethXXLSrc = '../../assets/Images/eth_xl.png';

    private yam = '../../assets/Images/yam.png';
    // TODO: ADD Uniswap Ample LP pool contract to array
    // COMP, LEND, LINK, MKR, SNX, Weth, YFI, 
    private yamContracts = ['0x8538e5910c6f80419cd3170c26073ff238048c9e', '0x6009a344c7f993b16eba2c673fefd2e07f9be5fd', '0xfdc28897a1e32b595f1f4f1d3ae0df93b1eee452', '0xcfe1e539acb2d489a651ca011a6eb93d32f97e23', '0x6c3fc1ffdb14d92394f40eec91d9ce8b807f132d', '0x587a07ce5c265a38dd6d42def1566ba73eeb06f5', '0xc5b6488c7d5bed173b76bd5dca712f45fb9eaeab']

    constructor(private context: CanvasRenderingContext2D, transaction, canvasWidth) {
        this.transaction = transaction;
        if (this.isYam(transaction)) {
            console.log("YAMFAM");
        }
        this.setSize(transaction.value);
        this.setSpeed(this.convertToGwei(transaction.gasPrice));
        this.x = this.generateRandom(0.0, canvasWidth);
    }

    moveDown() {
        this.y = this.y + this.speed;
        this.draw();
    }

    // min included, max excluded
    private generateRandom(min, max) {
        return Math.random() < 0.5 ? (( 1 - Math.random()) * (max - min) + min) : (Math.random() * (max - min) + min);
    }

    private isYam(tx) {
        console.log(tx.hash)
        if (this.yamContracts.includes(tx.to.toLowerCase()) || this.yamContracts.includes(tx.from.toLowerCase())) {
            console.log('FOUND')
            return true;
        } else {
            return false;
        }
    }

    private setSize(value) {
        // Less than .1 eth
        if (value < 100000000000000000) {
            this.width = 24;
            this.height = 28;
            this.eth.src = this.ethXSSrc;
        } else if (value < 1000000000000000000) {
            // less than 1 eth
            this.width = 34;
            this.height = 50;
            this.eth.src = this.ethSmallSrc;
        } else if (value < 10000000000000000000) {
            // less than 10 eth
            this.width = 51;
            this.height = 72;
            this.eth.src = this.ethMedSrc;
        } else if (value < 100000000000000000000) {
            // less than 100 eth
            this.width = 73;
            this.height = 100;
            this.eth.src = this.ethLargeSrc;
        } else if (value < 1000000000000000000000) {
            // less than 1000 eth
            this.width = 112;
            this.height = 170;
            this.eth.src = this.ethXLSrc;
        } else {
            // Greater than 1000
            this.width = 164;
            this.height = 245;
            this.eth.src = this.ethXXLSrc;
        }
    }

    private setSpeed(gasPrice) {
        if (gasPrice < 40) {
            this.speed = this.generateRandom(0.5, 1.0);
        } else if (gasPrice < 60) {
            this.speed = this.generateRandom(1.0, 2.0);
        } else if (gasPrice < 100) {
            this.speed = this.generateRandom(2.0, 3.0);
        } else if (gasPrice < 150) {
            this.speed = this.generateRandom(3.0, 4.0);
        } else {
            this.speed = this.generateRandom(4.0, 5.0);
        }
    }

    private draw() {
        this.context.drawImage(this.eth, this.x, this.y, this.width, this.height);
    }

    private convertToGwei(wei) {
        return wei / 10**9
      }
}
