/**
 * Album Drawing Manager
 * 자유 그리기 기능
 */

class AlbumDrawingManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        
        this.isDrawingMode = false;
        this.brushColor = '#000000';
        this.brushWidth = 5;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('DrawingManager: Initializing...');
        
        // 브러시 설정
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = this.brushColor;
        this.canvas.freeDrawingBrush.width = this.brushWidth;
    }
    
    /**
     * 그리기 모드 토글
     */
    toggleDrawingMode() {
        this.isDrawingMode = !this.isDrawingMode;
        this.canvas.isDrawingMode = this.isDrawingMode;
        
        if (this.isDrawingMode) {
            console.log('DrawingManager: Drawing mode enabled');
            // 객체 선택 비활성화
            this.canvas.selection = false;
        } else {
            console.log('DrawingManager: Drawing mode disabled');
            // 객체 선택 활성화
            this.canvas.selection = true;
        }
        
        return this.isDrawingMode;
    }
    
    /**
     * 그리기 모드 활성화
     */
    enableDrawingMode() {
        if (!this.isDrawingMode) {
            this.toggleDrawingMode();
        }
    }
    
    /**
     * 그리기 모드 비활성화
     */
    disableDrawingMode() {
        if (this.isDrawingMode) {
            this.toggleDrawingMode();
        }
    }
    
    /**
     * 브러시 색상 설정
     */
    setBrushColor(color) {
        this.brushColor = color;
        this.canvas.freeDrawingBrush.color = color;
        console.log('DrawingManager: Brush color set to', color);
    }
    
    /**
     * 브러시 굵기 설정
     */
    setBrushWidth(width) {
        this.brushWidth = parseInt(width);
        this.canvas.freeDrawingBrush.width = this.brushWidth;
        console.log('DrawingManager: Brush width set to', width);
    }
    
    /**
     * 지우개 모드 활성화
     */
    enableEraserMode() {
        this.enableDrawingMode();
        
        // 지우개 브러시 생성 (흰색으로 그리기)
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = '#FFFFFF';
        this.canvas.freeDrawingBrush.width = this.brushWidth * 2;
        
        console.log('DrawingManager: Eraser mode enabled');
    }
    
    /**
     * 펜 모드로 돌아가기
     */
    enablePenMode() {
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = this.brushColor;
        this.canvas.freeDrawingBrush.width = this.brushWidth;
        
        console.log('DrawingManager: Pen mode enabled');
    }
    
    /**
     * 모든 그림 지우기
     */
    clearDrawings() {
        const objects = this.canvas.getObjects();
        const pathObjects = objects.filter(obj => obj.type === 'path');
        
        pathObjects.forEach(obj => {
            this.canvas.remove(obj);
        });
        
        this.canvas.renderAll();
        console.log('DrawingManager: All drawings cleared');
    }
    
    /**
     * 현재 상태 가져오기
     */
    getState() {
        return {
            isDrawingMode: this.isDrawingMode,
            brushColor: this.brushColor,
            brushWidth: this.brushWidth
        };
    }
}
