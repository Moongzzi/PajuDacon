/**
 * Album Filters & Image Tools Manager
 * 이미지 필터 및 크롭/회전 기능
 */

class AlbumFiltersManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('FiltersManager: Initializing...');
    }
    
    /**
     * 필터 적용
     */
    applyFilter(filterType) {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject || activeObject.type !== 'image') {
            alert('이미지를 선택해주세요.');
            return;
        }
        
        // 기존 필터 제거
        activeObject.filters = [];
        
        switch(filterType) {
            case 'grayscale':
                activeObject.filters.push(new fabric.Image.filters.Grayscale());
                break;
                
            case 'sepia':
                activeObject.filters.push(new fabric.Image.filters.Sepia());
                break;
                
            case 'blur':
                activeObject.filters.push(new fabric.Image.filters.Blur({
                    blur: 0.3
                }));
                break;
                
            case 'brightness':
                activeObject.filters.push(new fabric.Image.filters.Brightness({
                    brightness: 0.2
                }));
                break;
                
            case 'contrast':
                activeObject.filters.push(new fabric.Image.filters.Contrast({
                    contrast: 0.2
                }));
                break;
                
            case 'vintage':
                activeObject.filters.push(new fabric.Image.filters.Sepia());
                activeObject.filters.push(new fabric.Image.filters.Contrast({
                    contrast: -0.1
                }));
                break;
                
            case 'remove':
                // 필터 제거 (이미 위에서 제거됨)
                break;
                
            default:
                console.log('Unknown filter type:', filterType);
                return;
        }
        
        activeObject.applyFilters();
        this.canvas.renderAll();
        console.log('FiltersManager: Applied filter -', filterType);
    }
    
    /**
     * 이미지 크롭 모드 활성화
     */
    enableCropMode() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject || activeObject.type !== 'image') {
            alert('이미지를 선택해주세요.');
            return;
        }
        
        // 크롭 UI 표시
        alert('크롭 기능: 이미지 모서리를 드래그하여 크기를 조절한 후 다시 클릭하여 적용하세요.');
        
        // 크롭 적용 (클립 패스 사용)
        const width = activeObject.width * activeObject.scaleX;
        const height = activeObject.height * activeObject.scaleY;
        
        activeObject.set({
            clipPath: new fabric.Rect({
                width: width * 0.8,
                height: height * 0.8,
                top: -height * 0.4,
                left: -width * 0.4,
                absolutePositioned: false
            })
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Crop mode enabled');
    }
    
    /**
     * 크롭 해제
     */
    removeCrop() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject || activeObject.type !== 'image') {
            alert('이미지를 선택해주세요.');
            return;
        }
        
        activeObject.set({
            clipPath: null
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Crop removed');
    }
    
    /**
     * 좌우 반전
     */
    flipHorizontal() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        activeObject.set({
            flipX: !activeObject.flipX
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Flipped horizontal');
    }
    
    /**
     * 상하 반전
     */
    flipVertical() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        activeObject.set({
            flipY: !activeObject.flipY
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Flipped vertical');
    }
    
    /**
     * 90도 회전
     */
    rotate90() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        const currentAngle = activeObject.angle || 0;
        activeObject.set({
            angle: (currentAngle + 90) % 360
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Rotated 90 degrees');
    }
    
    /**
     * 시계 방향 회전 (15도)
     */
    rotateClockwise() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        const currentAngle = activeObject.angle || 0;
        activeObject.set({
            angle: (currentAngle + 15) % 360
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Rotated clockwise');
    }
    
    /**
     * 반시계 방향 회전 (15도)
     */
    rotateCounterClockwise() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        const currentAngle = activeObject.angle || 0;
        activeObject.set({
            angle: (currentAngle - 15 + 360) % 360
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Rotated counter-clockwise');
    }
    
    /**
     * 회전 초기화
     */
    resetRotation() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        activeObject.set({
            angle: 0
        });
        
        this.canvas.renderAll();
        console.log('FiltersManager: Rotation reset');
    }
}
