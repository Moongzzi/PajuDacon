/**
 * Album Shortcuts Manager
 * 키보드 단축키 및 복사/붙여넣기 기능
 */

class AlbumShortcutsManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        this.clipboard = null;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('ShortcutsManager: Initializing...');
        this.registerKeyboardShortcuts();
    }
    
    /**
     * 키보드 단축키 등록
     */
    registerKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 모달이 열려있지 않으면 무시
            if (!this.editor.modal.classList.contains('active')) return;
            
            // 입력 필드에 포커스가 있으면 무시
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            // 텍스트 편집 중이면 무시
            const activeObject = this.canvas.getActiveObject();
            if (activeObject?.isEditing) return;
            
            // Ctrl/Cmd + C: 복사
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                this.copy();
            }
            
            // Ctrl/Cmd + V: 붙여넣기
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                this.paste();
            }
            
            // Ctrl/Cmd + D: 복제
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.duplicate();
            }
            
            // Delete: 삭제
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this.deleteSelected();
            }
            
            // Arrow Keys: 이동
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1; // Shift로 빠른 이동
                this.moveSelected(e.key, step);
            }
            
            // Ctrl/Cmd + A: 전체 선택
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                this.selectAll();
            }
        });
    }
    
    /**
     * 복사
     */
    copy() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            console.log('ShortcutsManager: No object to copy');
            return;
        }
        
        activeObject.clone((cloned) => {
            this.clipboard = cloned;
            console.log('ShortcutsManager: Object copied');
        });
    }
    
    /**
     * 붙여넣기
     */
    paste() {
        if (!this.clipboard) {
            console.log('ShortcutsManager: Nothing to paste, trying image clipboard...');
            // 객체 클립보드가 비어있으면 이미지 클립보드 시도
            this.tryImageClipboard();
            return;
        }
        
        this.clipboard.clone((clonedObj) => {
            this.canvas.discardActiveObject();
            
            clonedObj.set({
                left: clonedObj.left + 20,
                top: clonedObj.top + 20,
                evented: true,
            });
            
            if (clonedObj.type === 'activeSelection') {
                // 그룹 복사
                clonedObj.canvas = this.canvas;
                clonedObj.forEachObject((obj) => {
                    this.canvas.add(obj);
                });
                clonedObj.setCoords();
            } else {
                this.canvas.add(clonedObj);
            }
            
            this.clipboard.top += 20;
            this.clipboard.left += 20;
            
            this.canvas.setActiveObject(clonedObj);
            this.canvas.requestRenderAll();
            
            console.log('ShortcutsManager: Object pasted');
        });
    }
    
    /**
     * 이미지 클립보드에서 붙여넣기 시도
     */
    async tryImageClipboard() {
        try {
            if (!navigator.clipboard || !navigator.clipboard.read) {
                console.log('Clipboard API not supported');
                return;
            }
            
            const clipboardItems = await navigator.clipboard.read();
            
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        const blob = await clipboardItem.getType(type);
                        this.editor.handleClipboardImage(blob);
                        return;
                    }
                }
            }
            
            console.log('No image found in clipboard');
        } catch (err) {
            console.log('Could not read from clipboard:', err);
        }
    }
    
    /**
     * 복제 (복사 + 붙여넣기)
     */
    duplicate() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        activeObject.clone((cloned) => {
            this.canvas.discardActiveObject();
            
            cloned.set({
                left: cloned.left + 20,
                top: cloned.top + 20,
                evented: true,
            });
            
            if (cloned.type === 'activeSelection') {
                cloned.canvas = this.canvas;
                cloned.forEachObject((obj) => {
                    this.canvas.add(obj);
                });
                cloned.setCoords();
            } else {
                this.canvas.add(cloned);
            }
            
            this.canvas.setActiveObject(cloned);
            this.canvas.requestRenderAll();
            
            console.log('ShortcutsManager: Object duplicated');
        });
    }
    
    /**
     * 선택된 객체 삭제
     */
    deleteSelected() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        if (activeObject.type === 'activeSelection') {
            // 다중 선택 삭제
            activeObject.forEachObject((obj) => {
                this.canvas.remove(obj);
            });
        } else {
            this.canvas.remove(activeObject);
        }
        
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
        
        console.log('ShortcutsManager: Object deleted');
    }
    
    /**
     * 선택된 객체 이동
     */
    moveSelected(direction, step) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;
        
        switch(direction) {
            case 'ArrowUp':
                activeObject.set('top', activeObject.top - step);
                break;
            case 'ArrowDown':
                activeObject.set('top', activeObject.top + step);
                break;
            case 'ArrowLeft':
                activeObject.set('left', activeObject.left - step);
                break;
            case 'ArrowRight':
                activeObject.set('left', activeObject.left + step);
                break;
        }
        
        activeObject.setCoords();
        this.canvas.requestRenderAll();
        this.editor.markAsModified();
    }
    
    /**
     * 전체 선택
     */
    selectAll() {
        const objects = this.canvas.getObjects().filter(obj => 
            obj.selectable !== false && obj.evented !== false
        );
        
        if (objects.length === 0) return;
        
        const selection = new fabric.ActiveSelection(objects, {
            canvas: this.canvas
        });
        
        this.canvas.setActiveObject(selection);
        this.canvas.requestRenderAll();
        
        console.log('ShortcutsManager: All objects selected');
    }
}
