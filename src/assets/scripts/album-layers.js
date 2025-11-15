/**
 * Album Layers Manager
 * 레이어 관리 기능
 */

class AlbumLayersManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        this.layersList = document.getElementById('layersList');
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('LayersManager: Initializing...');
        
        // 캔버스 이벤트 리스너
        this.canvas.on('object:added', () => this.updateLayersList());
        this.canvas.on('object:removed', () => this.updateLayersList());
        this.canvas.on('object:modified', () => this.updateLayersList());
        this.canvas.on('selection:created', () => this.updateLayersList());
        this.canvas.on('selection:updated', () => this.updateLayersList());
        this.canvas.on('selection:cleared', () => this.updateLayersList());
    }
    
    /**
     * 레이어 목록 업데이트
     */
    updateLayersList() {
        if (!this.layersList) return;
        
        const objects = this.canvas.getObjects().filter(obj => 
            obj.selectable !== false && obj.evented !== false
        );
        
        if (objects.length === 0) {
            this.layersList.innerHTML = '<p class="empty-state">객체가 없습니다</p>';
            return;
        }
        
        const activeObject = this.canvas.getActiveObject();
        
        this.layersList.innerHTML = '';
        
        // 역순으로 표시 (위에서 아래로)
        objects.slice().reverse().forEach((obj, index) => {
            const actualIndex = objects.length - 1 - index;
            const layerItem = this.createLayerItem(obj, actualIndex);
            
            if (activeObject === obj) {
                layerItem.classList.add('active');
            }
            
            this.layersList.appendChild(layerItem);
        });
    }
    
    /**
     * 레이어 아이템 생성
     */
    createLayerItem(obj, index) {
        const div = document.createElement('div');
        div.className = 'layer-item';
        div.dataset.objectIndex = index;
        
        const icon = this.getObjectIcon(obj);
        const name = this.getObjectName(obj, index);
        const type = this.getObjectType(obj);
        
        div.innerHTML = `
            <i class="layer-icon ${icon}"></i>
            <div class="layer-info">
                <p class="layer-name">${name}</p>
                <p class="layer-type">${type}</p>
            </div>
            <div class="layer-controls">
                <button class="layer-control-btn visibility-btn ${obj.visible ? 'active' : ''}" 
                        title="${obj.visible ? '숨기기' : '보이기'}">
                    <i class="fas ${obj.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>
                <button class="layer-control-btn lock-btn ${obj.lockMovementX ? 'active' : ''}" 
                        title="${obj.lockMovementX ? '잠금 해제' : '잠금'}">
                    <i class="fas ${obj.lockMovementX ? 'fa-lock' : 'fa-lock-open'}"></i>
                </button>
            </div>
        `;
        
        // 이벤트 리스너
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.layer-control-btn')) {
                this.selectObject(obj);
            }
        });
        
        // 가시성 토글
        const visibilityBtn = div.querySelector('.visibility-btn');
        visibilityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleVisibility(obj);
        });
        
        // 잠금 토글
        const lockBtn = div.querySelector('.lock-btn');
        lockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLock(obj);
        });
        
        return div;
    }
    
    /**
     * 객체 아이콘 가져오기
     */
    getObjectIcon(obj) {
        switch(obj.type) {
            case 'image': return 'fas fa-image';
            case 'i-text':
            case 'text': return 'fas fa-font';
            case 'rect': return 'fas fa-square';
            case 'circle': return 'fas fa-circle';
            case 'triangle': return 'fas fa-play';
            case 'line': return 'fas fa-minus';
            case 'path': return 'fas fa-draw-polygon';
            default: return 'fas fa-shapes';
        }
    }
    
    /**
     * 객체 이름 가져오기
     */
    getObjectName(obj, index) {
        if (obj.name) return obj.name;
        
        switch(obj.type) {
            case 'image': return `이미지 ${index + 1}`;
            case 'i-text':
            case 'text': 
                const text = obj.text.substring(0, 15);
                return text.length < obj.text.length ? text + '...' : text;
            case 'rect': return `사각형 ${index + 1}`;
            case 'circle': return `원 ${index + 1}`;
            case 'triangle': return `삼각형 ${index + 1}`;
            case 'line': return `선 ${index + 1}`;
            case 'path': return `도형 ${index + 1}`;
            default: return `객체 ${index + 1}`;
        }
    }
    
    /**
     * 객체 타입 가져오기
     */
    getObjectType(obj) {
        switch(obj.type) {
            case 'image': return '이미지';
            case 'i-text':
            case 'text': return '텍스트';
            case 'rect': return '사각형';
            case 'circle': return '원';
            case 'triangle': return '삼각형';
            case 'line': return '선';
            case 'path': return '자유 곡선';
            default: return '객체';
        }
    }
    
    /**
     * 객체 선택
     */
    selectObject(obj) {
        this.canvas.setActiveObject(obj);
        this.canvas.renderAll();
    }
    
    /**
     * 가시성 토글
     */
    toggleVisibility(obj) {
        obj.set('visible', !obj.visible);
        this.canvas.renderAll();
        this.updateLayersList();
        this.editor.markAsModified();
    }
    
    /**
     * 잠금 토글
     */
    toggleLock(obj) {
        const locked = !obj.lockMovementX;
        obj.set({
            lockMovementX: locked,
            lockMovementY: locked,
            lockRotation: locked,
            lockScalingX: locked,
            lockScalingY: locked,
            selectable: !locked,
            hasControls: !locked
        });
        this.canvas.renderAll();
        this.updateLayersList();
        this.editor.markAsModified();
    }
    
    /**
     * 레이어 순서 변경 - 맨 앞으로
     */
    bringToFront(obj) {
        this.canvas.bringToFront(obj);
        this.canvas.renderAll();
        this.updateLayersList();
        this.editor.markAsModified();
    }
    
    /**
     * 레이어 순서 변경 - 앞으로
     */
    bringForward(obj) {
        this.canvas.bringForward(obj);
        this.canvas.renderAll();
        this.updateLayersList();
        this.editor.markAsModified();
    }
    
    /**
     * 레이어 순서 변경 - 뒤로
     */
    sendBackwards(obj) {
        this.canvas.sendBackwards(obj);
        this.canvas.renderAll();
        this.updateLayersList();
        this.editor.markAsModified();
    }
    
    /**
     * 레이어 순서 변경 - 맨 뒤로
     */
    sendToBack(obj) {
        this.canvas.sendToBack(obj);
        this.canvas.renderAll();
        this.updateLayersList();
        this.editor.markAsModified();
    }
    
    /**
     * 선택된 객체의 순서 변경 메서드들
     */
    bringSelectedToFront() {
        const obj = this.canvas.getActiveObject();
        if (obj) this.bringToFront(obj);
    }
    
    bringSelectedForward() {
        const obj = this.canvas.getActiveObject();
        if (obj) this.bringForward(obj);
    }
    
    sendSelectedBackwards() {
        const obj = this.canvas.getActiveObject();
        if (obj) this.sendBackwards(obj);
    }
    
    sendSelectedToBack() {
        const obj = this.canvas.getActiveObject();
        if (obj) this.sendToBack(obj);
    }
}
