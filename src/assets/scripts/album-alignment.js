/**
 * Album Alignment Manager
 * 정렬 및 배치 기능
 */

class AlbumAlignmentManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('AlignmentManager: Initializing...');
        this.bindAlignButtons();
    }
    
    /**
     * 정렬 버튼 이벤트 바인딩
     */
    bindAlignButtons() {
        const buttons = {
            alignLeft: () => this.alignLeft(),
            alignCenter: () => this.alignCenter(),
            alignRight: () => this.alignRight(),
            alignTop: () => this.alignTop(),
            alignMiddle: () => this.alignMiddle(),
            alignBottom: () => this.alignBottom(),
            distributeHorizontal: () => this.distributeHorizontal(),
            distributeVertical: () => this.distributeVertical()
        };
        
        Object.keys(buttons).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', buttons[id]);
            }
        });
    }
    
    /**
     * 왼쪽 정렬
     */
    alignLeft() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            const objects = activeObject.getObjects();
            const leftmost = Math.min(...objects.map(obj => obj.left - obj.width * obj.scaleX / 2));
            
            objects.forEach(obj => {
                obj.set('left', leftmost + obj.width * obj.scaleX / 2);
                obj.setCoords();
            });
        }
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Aligned left');
    }
    
    /**
     * 가로 중앙 정렬
     */
    alignCenter() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            const objects = activeObject.getObjects();
            const bounds = this.getSelectionBounds(objects);
            const centerX = bounds.left + bounds.width / 2;
            
            objects.forEach(obj => {
                obj.set('left', centerX);
                obj.setCoords();
            });
        } else {
            activeObject.set('left', this.canvas.width / 2);
            activeObject.setCoords();
        }
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Aligned center');
    }
    
    /**
     * 오른쪽 정렬
     */
    alignRight() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            const objects = activeObject.getObjects();
            const rightmost = Math.max(...objects.map(obj => obj.left + obj.width * obj.scaleX / 2));
            
            objects.forEach(obj => {
                obj.set('left', rightmost - obj.width * obj.scaleX / 2);
                obj.setCoords();
            });
        }
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Aligned right');
    }
    
    /**
     * 위쪽 정렬
     */
    alignTop() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            const objects = activeObject.getObjects();
            const topmost = Math.min(...objects.map(obj => obj.top - obj.height * obj.scaleY / 2));
            
            objects.forEach(obj => {
                obj.set('top', topmost + obj.height * obj.scaleY / 2);
                obj.setCoords();
            });
        }
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Aligned top');
    }
    
    /**
     * 세로 중앙 정렬
     */
    alignMiddle() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            const objects = activeObject.getObjects();
            const bounds = this.getSelectionBounds(objects);
            const centerY = bounds.top + bounds.height / 2;
            
            objects.forEach(obj => {
                obj.set('top', centerY);
                obj.setCoords();
            });
        } else {
            activeObject.set('top', this.canvas.height / 2);
            activeObject.setCoords();
        }
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Aligned middle');
    }
    
    /**
     * 아래쪽 정렬
     */
    alignBottom() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            const objects = activeObject.getObjects();
            const bottommost = Math.max(...objects.map(obj => obj.top + obj.height * obj.scaleY / 2));
            
            objects.forEach(obj => {
                obj.set('top', bottommost - obj.height * obj.scaleY / 2);
                obj.setCoords();
            });
        }
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Aligned bottom');
    }
    
    /**
     * 가로 균등 분배
     */
    distributeHorizontal() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject || activeObject.type !== 'activeSelection') return;
        
        const objects = activeObject.getObjects();
        if (objects.length < 3) return;
        
        // 왼쪽부터 정렬
        objects.sort((a, b) => a.left - b.left);
        
        const leftmost = objects[0].left;
        const rightmost = objects[objects.length - 1].left;
        const totalGap = rightmost - leftmost;
        const gap = totalGap / (objects.length - 1);
        
        objects.forEach((obj, index) => {
            obj.set('left', leftmost + gap * index);
            obj.setCoords();
        });
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Distributed horizontally');
    }
    
    /**
     * 세로 균등 분배
     */
    distributeVertical() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject || activeObject.type !== 'activeSelection') return;
        
        const objects = activeObject.getObjects();
        if (objects.length < 3) return;
        
        // 위에서부터 정렬
        objects.sort((a, b) => a.top - b.top);
        
        const topmost = objects[0].top;
        const bottommost = objects[objects.length - 1].top;
        const totalGap = bottommost - topmost;
        const gap = totalGap / (objects.length - 1);
        
        objects.forEach((obj, index) => {
            obj.set('top', topmost + gap * index);
            obj.setCoords();
        });
        
        this.canvas.renderAll();
        this.editor.markAsModified();
        console.log('AlignmentManager: Distributed vertically');
    }
    
    /**
     * 선택 영역의 경계 계산
     */
    getSelectionBounds(objects) {
        const lefts = objects.map(obj => obj.left - obj.width * obj.scaleX / 2);
        const rights = objects.map(obj => obj.left + obj.width * obj.scaleX / 2);
        const tops = objects.map(obj => obj.top - obj.height * obj.scaleY / 2);
        const bottoms = objects.map(obj => obj.top + obj.height * obj.scaleY / 2);
        
        const left = Math.min(...lefts);
        const right = Math.max(...rights);
        const top = Math.min(...tops);
        const bottom = Math.max(...bottoms);
        
        return {
            left,
            top,
            width: right - left,
            height: bottom - top
        };
    }
}
