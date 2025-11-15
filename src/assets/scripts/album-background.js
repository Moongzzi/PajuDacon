/**
 * Album Background Manager
 * 배경 색상, 패턴, 그라디언트 관리
 */

class AlbumBackgroundManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        
        this.currentBackground = {
            type: 'color',
            value: '#FFFFFF'
        };
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('BackgroundManager: Initializing...');
    }
    
    /**
     * 배경색 변경
     */
    setBackgroundColor(color) {
        this.canvas.backgroundColor = color;
        this.canvas.renderAll();
        
        this.currentBackground = {
            type: 'color',
            value: color
        };
        
        console.log('BackgroundManager: Background color set to', color);
    }
    
    /**
     * 그라디언트 배경 적용
     */
    setGradientBackground(type = 'linear', color1 = '#007bff', color2 = '#00d4ff') {
        let gradient;
        
        if (type === 'linear') {
            gradient = new fabric.Gradient({
                type: 'linear',
                gradientUnits: 'pixels',
                coords: {
                    x1: 0,
                    y1: 0,
                    x2: this.canvas.width,
                    y2: this.canvas.height
                },
                colorStops: [
                    { offset: 0, color: color1 },
                    { offset: 1, color: color2 }
                ]
            });
        } else if (type === 'radial') {
            gradient = new fabric.Gradient({
                type: 'radial',
                gradientUnits: 'pixels',
                coords: {
                    x1: this.canvas.width / 2,
                    y1: this.canvas.height / 2,
                    x2: this.canvas.width / 2,
                    y2: this.canvas.height / 2,
                    r1: 0,
                    r2: Math.max(this.canvas.width, this.canvas.height) / 2
                },
                colorStops: [
                    { offset: 0, color: color1 },
                    { offset: 1, color: color2 }
                ]
            });
        }
        
        this.canvas.backgroundColor = gradient;
        this.canvas.renderAll();
        
        this.currentBackground = {
            type: 'gradient',
            gradientType: type,
            colors: [color1, color2]
        };
        
        console.log('BackgroundManager: Gradient background applied', type);
    }
    
    /**
     * 패턴 배경 적용
     */
    setPatternBackground(patternType = 'dots') {
        // 패턴 캔버스 생성
        const patternCanvas = document.createElement('canvas');
        const ctx = patternCanvas.getContext('2d');
        
        switch(patternType) {
            case 'dots':
                this.createDotsPattern(patternCanvas, ctx);
                break;
            case 'stripes':
                this.createStripesPattern(patternCanvas, ctx);
                break;
            case 'grid':
                this.createGridPattern(patternCanvas, ctx);
                break;
            case 'diagonal':
                this.createDiagonalPattern(patternCanvas, ctx);
                break;
            default:
                this.createDotsPattern(patternCanvas, ctx);
        }
        
        // 패턴 생성
        const pattern = new fabric.Pattern({
            source: patternCanvas,
            repeat: 'repeat'
        });
        
        this.canvas.backgroundColor = pattern;
        this.canvas.renderAll();
        
        this.currentBackground = {
            type: 'pattern',
            patternType: patternType
        };
        
        console.log('BackgroundManager: Pattern background applied', patternType);
    }
    
    /**
     * 점 패턴 생성
     */
    createDotsPattern(canvas, ctx) {
        canvas.width = 20;
        canvas.height = 20;
        
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(0, 0, 20, 20);
        
        ctx.fillStyle = '#D0D0D0';
        ctx.beginPath();
        ctx.arc(10, 10, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * 줄무늬 패턴 생성
     */
    createStripesPattern(canvas, ctx) {
        canvas.width = 20;
        canvas.height = 20;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 20, 20);
        
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(0, 0, 10, 20);
    }
    
    /**
     * 격자 패턴 생성
     */
    createGridPattern(canvas, ctx) {
        canvas.width = 20;
        canvas.height = 20;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 20, 20);
        
        ctx.strokeStyle = '#D0D0D0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(20, 0);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20);
        ctx.stroke();
    }
    
    /**
     * 대각선 패턴 생성
     */
    createDiagonalPattern(canvas, ctx) {
        canvas.width = 20;
        canvas.height = 20;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 20, 20);
        
        ctx.strokeStyle = '#D0D0D0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(20, 0);
        ctx.stroke();
    }
    
    /**
     * 배경 초기화
     */
    resetBackground() {
        this.setBackgroundColor('#FFFFFF');
        console.log('BackgroundManager: Background reset');
    }
    
    /**
     * 현재 배경 정보 가져오기
     */
    getCurrentBackground() {
        return this.currentBackground;
    }
}
