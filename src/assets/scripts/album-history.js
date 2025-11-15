/**
 * Album History Manager
 * 실행 취소/다시 실행 기능
 */

class AlbumHistoryManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        this.history = [];
        this.currentStep = -1;
        this.maxHistory = 50; // 최대 히스토리 개수
        this.isRecording = true;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('HistoryManager: Initializing...');
        
        // 초기 상태 저장
        this.saveState();
        
        // 캔버스 이벤트 리스너
        this.canvas.on('object:added', () => this.saveState());
        this.canvas.on('object:modified', () => this.saveState());
        this.canvas.on('object:removed', () => this.saveState());
        
        // 단축키 등록
        this.registerShortcuts();
        
        // UI 버튼 업데이트
        this.updateButtons();
    }
    
    /**
     * 상태 저장
     */
    saveState() {
        if (!this.isRecording) return;
        
        // 현재 단계 이후의 히스토리 제거
        if (this.currentStep < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentStep + 1);
        }
        
        // 현재 캔버스 상태를 JSON으로 저장
        const state = JSON.stringify(this.canvas.toJSON());
        this.history.push(state);
        
        // 히스토리 개수 제한
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.currentStep++;
        }
        
        this.updateButtons();
        console.log(`HistoryManager: State saved (${this.currentStep + 1}/${this.history.length})`);
    }
    
    /**
     * 실행 취소
     */
    undo() {
        if (!this.canUndo()) {
            console.log('HistoryManager: Cannot undo');
            return;
        }
        
        this.currentStep--;
        this.restoreState(this.history[this.currentStep]);
        this.updateButtons();
        
        console.log(`HistoryManager: Undo (${this.currentStep + 1}/${this.history.length})`);
    }
    
    /**
     * 다시 실행
     */
    redo() {
        if (!this.canRedo()) {
            console.log('HistoryManager: Cannot redo');
            return;
        }
        
        this.currentStep++;
        this.restoreState(this.history[this.currentStep]);
        this.updateButtons();
        
        console.log(`HistoryManager: Redo (${this.currentStep + 1}/${this.history.length})`);
    }
    
    /**
     * 실행 취소 가능 여부
     */
    canUndo() {
        return this.currentStep > 0;
    }
    
    /**
     * 다시 실행 가능 여부
     */
    canRedo() {
        return this.currentStep < this.history.length - 1;
    }
    
    /**
     * 상태 복원
     */
    restoreState(state) {
        this.isRecording = false;
        
        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            this.isRecording = true;
            
            // 레이어 목록 업데이트
            if (this.editor.layersManager) {
                this.editor.layersManager.updateLayersList();
            }
        });
    }
    
    /**
     * 단축키 등록
     */
    registerShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 모달이 열려있고 입력 필드에 포커스가 없을 때만
            if (!this.editor.modal.classList.contains('active')) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (this.canvas.getActiveObject()?.isEditing) return;
            
            // Ctrl/Cmd + Z: 실행 취소
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            
            // Ctrl/Cmd + Y 또는 Ctrl/Cmd + Shift + Z: 다시 실행
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this.redo();
            }
        });
    }
    
    /**
     * 버튼 상태 업데이트
     */
    updateButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) {
            undoBtn.disabled = !this.canUndo();
        }
        
        if (redoBtn) {
            redoBtn.disabled = !this.canRedo();
        }
    }
    
    /**
     * 히스토리 초기화
     */
    clear() {
        this.history = [];
        this.currentStep = -1;
        this.saveState();
        console.log('HistoryManager: History cleared');
    }
}
