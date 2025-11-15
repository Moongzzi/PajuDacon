/**
 * Album Editor - Main JavaScript
 * 앨범 제작 기능을 위한 메인 스크립트
 */

class AlbumEditor {
    constructor() {
        this.canvas = null;
        this.modal = null;
        this.isInitialized = false;
        
        // 모듈 인스턴스
        this.layersManager = null;
        this.historyManager = null;
        this.shortcutsManager = null;
        this.alignmentManager = null;
        this.shapesManager = null;
        this.filtersManager = null;
        this.drawingManager = null;
        this.backgroundManager = null;
        this.advancedManager = null;
        
        // 상태 관리
        this.currentAlbum = {
            id: null,
            objects: [],
            background: null,
            lastSaved: null
        };
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('AlbumEditor: Initializing...');
        
        // DOM 요소 참조
        this.modal = document.getElementById('albumEditorModal');
        
        // 이벤트 리스너 등록
        this.registerEventListeners();
        
        console.log('AlbumEditor: Initialization complete');
    }
    
    /**
     * 이벤트 리스너 등록
     */
    registerEventListeners() {
        // 앨범 생성 버튼
        const createBtn = document.getElementById('createAlbumBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.openEditor());
        }
        
        // 모달 닫기 버튼 제거됨 - ESC 키로만 닫기 가능
        
        // 우측 사이드바 탭 전환
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // 요소 추가 버튼들
        const elementButtons = document.querySelectorAll('.element-btn');
        elementButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.getAttribute('data-type');
                if (type) {
                    this.handleElementAdd(type);
                    // 우측 사이드바 토글 처리
                    this.handleRightSidebarToggle(type);
                }
            });
        });

        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeEditor();
            }
        });
    }
    
    /**
     * 탭 전환
     */
    switchTab(tabName) {
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 모든 탭 패널 숨김
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // 선택된 탭 활성화
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedPanel = document.getElementById(`${tabName}Tab`);
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedPanel) selectedPanel.classList.add('active');
        
        console.log('AlbumEditor: Switched to tab:', tabName);
    }
    
    /**
     * 요소 추가 처리
     */
    handleElementAdd(type) {
        console.log('AlbumEditor: Adding element type:', type);
        
        switch(type) {
            case 'image':
                this.addImageElement();
                break;
            case 'text':
                this.addTextElement();
                break;
            case 'sticker':
                this.addStickerElement();
                break;
            default:
                console.warn('AlbumEditor: Unknown element type:', type);
        }
    }
    
    /**
     * 이미지 추가
     */
    addImageElement() {
        console.log('AlbumEditor: Opening image file selector...');
        
        // 파일 입력 생성
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadImageFromFile(file);
            }
        };
        
        input.click();
    }
    
    /**
     * 파일에서 이미지 로드
     */
    loadImageFromFile(file) {
        console.log('AlbumEditor: Loading image from file...', file.name);
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            
            fabric.Image.fromURL(imageUrl, (img) => {
                // 이미지 크기 조정 (최대 400px)
                const maxSize = 400;
                const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
                
                img.set({
                    left: this.canvas.width / 2,
                    top: this.canvas.height / 2,
                    originX: 'center',
                    originY: 'center',
                    scaleX: scale,
                    scaleY: scale,
                    cornerSize: 10,
                    transparentCorners: false,
                    borderColor: '#007bff',
                    cornerColor: '#007bff',
                    cornerStyle: 'circle'
                });
                
                this.canvas.add(img);
                this.canvas.setActiveObject(img);
                this.canvas.renderAll();
                this.markAsModified();
                
                console.log('AlbumEditor: Image added to canvas');
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * 텍스트 추가
     */
    addTextElement() {
        console.log('AlbumEditor: Adding text element...');
        
        const text = new fabric.Textbox('텍스트를 입력하세요', {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            width: 200,
            originX: 'center',
            originY: 'center',
            fontFamily: 'Malgun Gothic, sans-serif',
            fontSize: 32,
            fill: '#333333',
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle',
            editable: true,
            lockScalingFlip: true,
            noScaleCache: false,
            strokeUniform: true
        });
        
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        
        // 텍스트 편집 모드로 진입
        text.enterEditing();
        text.selectAll();
        
        this.canvas.renderAll();
        this.markAsModified();
        
        console.log('AlbumEditor: Text element added');
    }
    
    /**
     * 스티커 추가
     */
    addStickerElement() {
        console.log('AlbumEditor: Opening sticker panel...');
        
        // 요소 카테고리 숨기고 스티커 패널 표시
        const elementCategory = document.querySelector('.element-category');
        const stickerPanel = document.getElementById('stickerPanel');
        
        if (elementCategory && stickerPanel) {
            elementCategory.style.display = 'none';
            stickerPanel.style.display = 'block';
            
            // 스티커 선택 이벤트
            this.bindStickerSelection();
            
            // 뒤로가기 버튼
            const backBtn = document.getElementById('backToElements');
            if (backBtn) {
                backBtn.onclick = () => {
                    elementCategory.style.display = 'grid';
                    stickerPanel.style.display = 'none';
                };
            }
        }
    }
    
    /**
     * 스티커 선택 이벤트 바인딩
     */
    bindStickerSelection() {
        const stickerItems = document.querySelectorAll('.sticker-item');
        
        stickerItems.forEach(item => {
            // 이미 이벤트가 바인딩되어 있으면 제거
            item.replaceWith(item.cloneNode(true));
        });
        
        // 새로 선택된 요소들에 이벤트 바인딩
        document.querySelectorAll('.sticker-item').forEach(item => {
            item.addEventListener('click', () => {
                const icon = item.getAttribute('data-icon');
                
                // 이모지인 경우
                if (icon && !item.querySelector('i')) {
                    this.addEmojiSticker(icon);
                } else {
                    // Font Awesome 아이콘인 경우
                    const iconElement = item.querySelector('i');
                    if (iconElement) {
                        const iconClass = Array.from(iconElement.classList)
                            .find(cls => cls.startsWith('fa-') && cls !== 'fas' && cls !== 'far' && cls !== 'fab');
                        if (iconClass) {
                            this.addFontAwesomeSticker(iconClass);
                        }
                    }
                }
            });
        });
    }
    
    /**
     * 이모지 스티커 추가
     */
    addEmojiSticker(emoji) {
        console.log('AlbumEditor: Adding emoji sticker...', emoji);
        
        const text = new fabric.Text(emoji, {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 80,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
        this.markAsModified();
        
        // 패널 닫기
        this.closeStickerPanel();
    }
    
    /**
     * Font Awesome 아이콘 스티커 추가
     */
    addFontAwesomeSticker(iconClass) {
        console.log('AlbumEditor: Adding Font Awesome sticker...', iconClass);
        
        // SVG로 변환하여 추가
        const iconCode = this.getFontAwesomeIconCode(iconClass);
        
        if (iconCode) {
            const text = new fabric.Text(iconCode, {
                left: this.canvas.width / 2,
                top: this.canvas.height / 2,
                originX: 'center',
                originY: 'center',
                fontFamily: 'Font Awesome 6 Free',
                fontSize: 80,
                fill: '#333333',
                cornerSize: 10,
                transparentCorners: false,
                borderColor: '#007bff',
                cornerColor: '#007bff',
                cornerStyle: 'circle'
            });
            
            this.canvas.add(text);
            this.canvas.setActiveObject(text);
            this.canvas.renderAll();
            this.markAsModified();
        }
        
        // 패널 닫기
        this.closeStickerPanel();
    }
    
    /**
     * Font Awesome 아이콘 유니코드 가져오기
     */
    getFontAwesomeIconCode(iconClass) {
        const iconMap = {
            'fa-heart': '\uf004',
            'fa-star': '\uf005',
            'fa-bookmark': '\uf02e',
            'fa-camera': '\uf030',
            'fa-book': '\uf02d',
            'fa-leaf': '\uf06c',
            'fa-sun': '\uf185',
            'fa-moon': '\uf186'
        };
        
        return iconMap[iconClass] || null;
    }
    
    /**
     * 스티커 패널 닫기
     */
    closeStickerPanel() {
        const elementCategory = document.querySelector('.element-category');
        const stickerPanel = document.getElementById('stickerPanel');
        
        if (elementCategory && stickerPanel) {
            elementCategory.style.display = 'grid';
            stickerPanel.style.display = 'none';
        }
    }
    
    /**
     * 에디터 열기
     */
    openEditor() {
        console.log('AlbumEditor: Opening editor...');
        
        // 모달 표시
        this.modal.classList.add('active');
        
        // 모달의 z-index 확실히 설정
        this.modal.style.zIndex = '10000';
        
        // body에 modal-active 클래스 추가하여 배경 숨김
        document.body.classList.add('modal-active');
        
        // 캔버스 초기화 (한 번만)
        if (!this.isInitialized) {
            this.initializeCanvas();
            this.isInitialized = true;
        } else if (this.canvas) {
            // 이미 초기화된 경우 크기만 조정
            setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        }
        
        // body 스크롤 방지
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * 에디터 닫기
     */
    closeEditor() {
        console.log('AlbumEditor: Closing editor...');
        
        // 변경사항 확인
        if (this.hasUnsavedChanges()) {
            const confirmed = confirm('저장하지 않은 변경사항이 있습니다. 저장하고 나가시겠습니까?');
            if (confirmed) {
                this.saveAlbum();
            }
        }
        
        // 모달 숨기기
        this.modal.classList.remove('active');
        
        // z-index 초기화
        this.modal.style.zIndex = '';
        
        // body에서 modal-active 클래스 제거하여 배경 복원
        document.body.classList.remove('modal-active');
        
        // body 스크롤 복원
        document.body.style.overflow = '';
    }
    
    /**
     * 화면 크기에 맞는 최적의 캔버스 크기 계산
     */
    calculateOptimalCanvasSize() {
        // 캔버스 영역의 실제 사용 가능한 크기 계산
        const canvasArea = document.querySelector('.canvas-area');
        if (!canvasArea) {
            // 기본값 반환 (책 펼침 비율 2:1 유지)
            return { width: 800, height: 400 };
        }
        
        // 캔버스 영역의 패딩을 고려한 실제 사용 가능한 크기
        const areaRect = canvasArea.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(canvasArea);
        
        // 패딩 값 계산 (vh 단위를 px로 변환)
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        
        // 사용 가능한 실제 크기
        const availableWidth = areaRect.width - paddingLeft - paddingRight;
        const availableHeight = areaRect.height - paddingTop - paddingBottom;
        
        // 책 펼침 비율 2:1을 유지하면서 화면에 맞는 크기 계산
        const aspectRatio = 2; // 가로:세로 = 2:1
        
        let canvasWidth, canvasHeight;
        
        // 가로 기준으로 맞춰보기
        canvasWidth = Math.min(availableWidth * 0.9, 1200); // 최대 1200px, 여백 10%
        canvasHeight = canvasWidth / aspectRatio;
        
        // 세로가 너무 크면 세로 기준으로 다시 계산
        if (canvasHeight > availableHeight * 0.9) {
            canvasHeight = availableHeight * 0.9; // 여백 10%
            canvasWidth = canvasHeight * aspectRatio;
        }
        
        // 최소 크기 보장
        const minWidth = 400;
        const minHeight = 200;
        
        canvasWidth = Math.max(canvasWidth, minWidth);
        canvasHeight = Math.max(canvasHeight, minHeight);
        
        console.log('AlbumEditor: Calculated canvas size:', { width: canvasWidth, height: canvasHeight });
        
        return {
            width: Math.round(canvasWidth),
            height: Math.round(canvasHeight)
        };
    }
    
    /**
     * Fabric.js 캔버스 초기화
     */
    initializeCanvas() {
        console.log('AlbumEditor: Initializing Fabric.js canvas...');
        
        // 캔버스 크기를 화면에 맞게 동적으로 계산
        const canvasSize = this.calculateOptimalCanvasSize();
        
        // 캔버스 생성
        this.canvas = new fabric.Canvas('albumCanvas', {
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundColor: '#FFFFFF',
            selection: true,
            preserveObjectStacking: true
        });
        
        // 책 배경 이미지 로드
        this.loadBookBackground();
        
        // 레이어 매니저 초기화
        this.layersManager = new AlbumLayersManager(this.canvas, this);
        
        // 히스토리 매니저 초기화
        this.historyManager = new AlbumHistoryManager(this.canvas, this);
        
        // 단축키 매니저 초기화
        this.shortcutsManager = new AlbumShortcutsManager(this.canvas, this);
        
        // 정렬 매니저 초기화
        this.alignmentManager = new AlbumAlignmentManager(this.canvas, this);
        
        // 도형 매니저 초기화
        this.shapesManager = new AlbumShapesManager(this.canvas, this);
        
        // 필터 매니저 초기화
        this.filtersManager = new AlbumFiltersManager(this.canvas, this);
        
        // 그리기 매니저 초기화
        this.drawingManager = new AlbumDrawingManager(this.canvas, this);
        
        // 배경 매니저 초기화
        this.backgroundManager = new AlbumBackgroundManager(this.canvas, this);
        
        // 고급 기능 매니저 초기화
        this.advancedManager = new AlbumAdvancedManager(this.canvas, this);
        
        // 레이어 순서 변경 버튼 이벤트
        this.initLayerOrderButtons();
        
        // 히스토리 버튼 이벤트 등록
        this.initHistoryButtons();
        
        // 도형 버튼 이벤트 등록
        this.initShapeButtons();
        
        // 필터 버튼 이벤트 등록
        this.initFilterButtons();
        
        // 도구 버튼 이벤트 등록
        this.initToolButtons();
        
        // 캔버스 이벤트 리스너
        this.canvas.on('selection:created', (e) => this.onObjectSelected(e));
        this.canvas.on('selection:updated', (e) => this.onObjectSelected(e));
        this.canvas.on('selection:cleared', () => this.onObjectDeselected());
        this.canvas.on('object:modified', () => this.markAsModified());
        
        // 클립보드 이미지 붙여넣기 이벤트
        this.initClipboardPaste();
        
        // 화면 크기 변경 감지
        this.initResizeHandler();
        
        console.log('AlbumEditor: Canvas initialized successfully');
    }
    
    /**
     * 레이어 순서 변경 버튼 초기화
     */
    initLayerOrderButtons() {
        const buttons = {
            bringToFront: document.getElementById('bringToFrontBtn'),
            bringForward: document.getElementById('bringForwardBtn'),
            sendBackwards: document.getElementById('sendBackwardsBtn'),
            sendToBack: document.getElementById('sendToBackBtn')
        };
        
        if (buttons.bringToFront) {
            buttons.bringToFront.addEventListener('click', () => 
                this.layersManager.bringSelectedToFront()
            );
        }
        
        if (buttons.bringForward) {
            buttons.bringForward.addEventListener('click', () => 
                this.layersManager.bringSelectedForward()
            );
        }
        
        if (buttons.sendBackwards) {
            buttons.sendBackwards.addEventListener('click', () => 
                this.layersManager.sendSelectedBackwards()
            );
        }
        
        if (buttons.sendToBack) {
            buttons.sendToBack.addEventListener('click', () => 
                this.layersManager.sendSelectedToBack()
            );
        }
    }
    
    /**
     * 도형 버튼 초기화
     */
    initShapeButtons() {
        const shapeButtons = document.querySelectorAll('.shape-btn');
        
        shapeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const shape = btn.getAttribute('data-shape');
                this.addShape(shape);
            });
        });
    }
    
    /**
     * 도형 추가
     */
    addShape(shapeType) {
        if (!this.shapesManager) {
            console.error('ShapesManager not initialized');
            return;
        }
        
        switch(shapeType) {
            case 'rectangle':
                this.shapesManager.addRectangle();
                break;
            case 'circle':
                this.shapesManager.addCircle();
                break;
            case 'triangle':
                this.shapesManager.addTriangle();
                break;
            case 'star':
                this.shapesManager.addStar();
                break;
            case 'heart':
                this.shapesManager.addHeart();
                break;
            case 'line':
                this.shapesManager.addLine();
                break;
            case 'arrow':
                this.shapesManager.addArrow();
                break;
            default:
                console.warn('Unknown shape type:', shapeType);
        }
        
        this.markAsModified();
    }
    
    /**
     * 필터 버튼 초기화
     */
    initFilterButtons() {
        // 필터 버튼
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filtersManager.applyFilter(filter);
                this.markAsModified();
            });
        });
        
        // 변형 버튼
        const flipHBtn = document.getElementById('flipHBtn');
        const flipVBtn = document.getElementById('flipVBtn');
        const rotate90Btn = document.getElementById('rotate90Btn');
        const rotateCWBtn = document.getElementById('rotateCWBtn');
        const rotateCCWBtn = document.getElementById('rotateCCWBtn');
        const resetRotBtn = document.getElementById('resetRotBtn');
        
        if (flipHBtn) {
            flipHBtn.addEventListener('click', () => {
                this.filtersManager.flipHorizontal();
                this.markAsModified();
            });
        }
        
        if (flipVBtn) {
            flipVBtn.addEventListener('click', () => {
                this.filtersManager.flipVertical();
                this.markAsModified();
            });
        }
        
        if (rotate90Btn) {
            rotate90Btn.addEventListener('click', () => {
                this.filtersManager.rotate90();
                this.markAsModified();
            });
        }
        
        if (rotateCWBtn) {
            rotateCWBtn.addEventListener('click', () => {
                this.filtersManager.rotateClockwise();
                this.markAsModified();
            });
        }
        
        if (rotateCCWBtn) {
            rotateCCWBtn.addEventListener('click', () => {
                this.filtersManager.rotateCounterClockwise();
                this.markAsModified();
            });
        }
        
        if (resetRotBtn) {
            resetRotBtn.addEventListener('click', () => {
                this.filtersManager.resetRotation();
                this.markAsModified();
            });
        }
        
        // 크롭 버튼
        const cropBtn = document.getElementById('cropBtn');
        const removeCropBtn = document.getElementById('removeCropBtn');
        
        if (cropBtn) {
            cropBtn.addEventListener('click', () => {
                this.filtersManager.enableCropMode();
                this.markAsModified();
            });
        }
        
        if (removeCropBtn) {
            removeCropBtn.addEventListener('click', () => {
                this.filtersManager.removeCrop();
                this.markAsModified();
            });
        }
    }
    
    /**
     * 히스토리 버튼 초기화 (되돌리기/재실행)
     */
    initHistoryButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.historyManager.undo();
            });
        }
        
        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                this.historyManager.redo();
            });
        }
    }
    
    /**
     * 화면 크기 변경 감지 및 캔버스 리사이즈
     */
    initResizeHandler() {
        let resizeTimeout;
        
        const handleResize = () => {
            // 디바운싱: 리사이즈 이벤트가 끝난 후 300ms 후에 실행
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.canvas) {
                    this.resizeCanvas();
                }
            }, 300);
        };
        
        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', handleResize);
        
        // 모달이 열릴 때도 캔버스 크기 조정 (DOM이 완전히 로드된 후)
        setTimeout(() => {
            if (this.canvas) {
                this.resizeCanvas();
            }
        }, 100);
    }
    
    /**
     * 캔버스 크기 동적 조정
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        console.log('AlbumEditor: Resizing canvas...');
        
        // 새로운 최적 크기 계산
        const newSize = this.calculateOptimalCanvasSize();
        
        // 현재 크기와 비교하여 변경이 필요한지 확인
        const currentWidth = this.canvas.getWidth();
        const currentHeight = this.canvas.getHeight();
        
        if (Math.abs(currentWidth - newSize.width) > 10 || 
            Math.abs(currentHeight - newSize.height) > 10) {
            
            // 캔버스 크기 변경
            this.canvas.setDimensions({
                width: newSize.width,
                height: newSize.height
            });
            
            // 배경 이미지가 있다면 크기에 맞게 조정
            if (this.canvas.backgroundImage) {
                this.adjustBackgroundImage();
            }
            
            // 캔버스 다시 렌더링
            this.canvas.renderAll();
            
            console.log('AlbumEditor: Canvas resized to:', newSize);
        }
    }
    
    /**
     * 배경 이미지 크기 조정
     */
    adjustBackgroundImage() {
        if (!this.canvas.backgroundImage) return;
        
        const img = this.canvas.backgroundImage;
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        
        // 배경 이미지를 캔버스 크기에 맞게 스케일 조정
        const scaleX = canvasWidth / img.width;
        const scaleY = canvasHeight / img.height;
        const scale = Math.max(scaleX, scaleY);
        
        img.set({
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            left: canvasWidth / 2,
            top: canvasHeight / 2
        });
    }
    
    /**
     * 클립보드 이미지 붙여넣기 초기화
     */
    initClipboardPaste() {
        // paste 이벤트만 사용 (Ctrl+V는 shortcuts manager에서 처리)
        document.addEventListener('paste', (e) => {
            console.log('Paste event triggered');
            
            // 모달이 열려있지 않으면 무시
            if (!this.modal.classList.contains('active')) {
                console.log('Modal not active, ignoring paste');
                return;
            }
            
            // 입력 필드에 포커스가 있으면 무시
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                console.log('Input field focused, ignoring paste');
                return;
            }
            
            // 텍스트 편집 중이면 무시
            const activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.isEditing) {
                console.log('Text editing, ignoring paste');
                return;
            }
            
            const items = e.clipboardData?.items;
            console.log('Clipboard items:', items);
            
            if (!items || items.length === 0) {
                console.log('No clipboard items');
                return;
            }
            
            for (let i = 0; i < items.length; i++) {
                console.log('Item ' + i + ' type:', items[i].type);
                if (items[i].type.indexOf('image') !== -1) {
                    console.log('Image found in clipboard');
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    console.log('Blob:', blob);
                    if (blob) {
                        this.handleClipboardImage(blob);
                        break;
                    }
                }
            }
        });
        
        console.log('Clipboard paste listener initialized');
    }
    
    /**
     * 클립보드 이미지 처리
     */
    handleClipboardImage(blob) {
        console.log('handleClipboardImage called with blob:', blob);
        
        if (!blob) {
            console.error('No blob provided');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            console.log('FileReader loaded, creating image...');
            
            fabric.Image.fromURL(event.target.result, (img) => {
                console.log('Image created:', img);
                
                // 캔버스 크기에 맞게 이미지 크기 조정
                const maxWidth = this.canvas.width * 0.5;
                const maxHeight = this.canvas.height * 0.5;
                
                if (img.width > maxWidth || img.height > maxHeight) {
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                    img.scale(scale);
                    console.log('Image scaled:', scale);
                }
                
                // 캔버스 중앙에 배치
                img.set({
                    left: this.canvas.width / 2,
                    top: this.canvas.height / 2,
                    originX: 'center',
                    originY: 'center',
                    cornerSize: 10,
                    transparentCorners: false,
                    borderColor: '#007bff',
                    cornerColor: '#007bff',
                    cornerStyle: 'circle'
                });
                
                this.canvas.add(img);
                this.canvas.setActiveObject(img);
                this.canvas.renderAll();
                this.markAsModified();
                
                console.log('AlbumEditor: Clipboard image added successfully');
            }, { crossOrigin: 'anonymous' });
        };
        
        reader.onerror = (error) => {
            console.error('FileReader error:', error);
        };
        
        console.log('Starting FileReader...');
        reader.readAsDataURL(blob);
    }
    
    /**
     * 도구 버튼 초기화 (그리기 & 배경)
     */
    initToolButtons() {
        // 그리기 모드 토글
        const drawingModeBtn = document.getElementById('drawingModeBtn');
        if (drawingModeBtn) {
            drawingModeBtn.addEventListener('click', () => {
                const isActive = this.drawingManager.toggleDrawingMode();
                drawingModeBtn.classList.toggle('active', isActive);
                // 하단 패널 제거됨
            });
        }
        
        // 브러시 색상
        const brushColor = document.getElementById('brushColor');
        if (brushColor) {
            brushColor.addEventListener('change', (e) => {
                this.drawingManager.setBrushColor(e.target.value);
            });
        }
        
        // 브러시 굵기
        const brushWidth = document.getElementById('brushWidth');
        const brushWidthValue = document.getElementById('brushWidthValue');
        if (brushWidth) {
            brushWidth.addEventListener('input', (e) => {
                this.drawingManager.setBrushWidth(e.target.value);
                if (brushWidthValue) {
                    brushWidthValue.textContent = e.target.value + 'px';
                }
            });
        }
        
        // 펜 모드
        const penModeBtn = document.getElementById('penModeBtn');
        if (penModeBtn) {
            penModeBtn.addEventListener('click', () => {
                this.drawingManager.enablePenMode();
                this.drawingManager.enableDrawingMode();
                penModeBtn.classList.add('active');
                document.getElementById('eraserModeBtn')?.classList.remove('active');
            });
        }
        
        // 지우개 모드
        const eraserModeBtn = document.getElementById('eraserModeBtn');
        if (eraserModeBtn) {
            eraserModeBtn.addEventListener('click', () => {
                this.drawingManager.enableEraserMode();
                eraserModeBtn.classList.add('active');
                penModeBtn?.classList.remove('active');
            });
        }
        
        // 그림 모두 지우기
        const clearDrawingsBtn = document.getElementById('clearDrawingsBtn');
        if (clearDrawingsBtn) {
            clearDrawingsBtn.addEventListener('click', () => {
                if (confirm('모든 그림을 지우시겠습니까?')) {
                    this.drawingManager.clearDrawings();
                    this.markAsModified();
                }
            });
        }
        
        // 배경색
        const bgColor = document.getElementById('bgColor');
        if (bgColor) {
            bgColor.addEventListener('change', (e) => {
                this.backgroundManager.setBackgroundColor(e.target.value);
                this.markAsModified();
            });
        }
        
        // 배경색 프리셋
        const bgPresetBtns = document.querySelectorAll('.bg-preset-btn');
        bgPresetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                this.backgroundManager.setBackgroundColor(color);
                if (bgColor) bgColor.value = color;
                this.markAsModified();
            });
        });
        
        // 그라디언트 버튼
        const gradientBtns = document.querySelectorAll('.gradient-btn');
        gradientBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.backgroundManager.setGradientBackground(type);
                this.markAsModified();
            });
        });
        
        // 패턴 버튼
        const patternBtns = document.querySelectorAll('.pattern-btn');
        patternBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const pattern = btn.getAttribute('data-pattern');
                this.backgroundManager.setPatternBackground(pattern);
                this.markAsModified();
            });
        });
        
        // 배경 초기화
        const resetBgBtn = document.getElementById('resetBgBtn');
        if (resetBgBtn) {
            resetBgBtn.addEventListener('click', () => {
                this.backgroundManager.resetBackground();
                if (bgColor) bgColor.value = '#FFFFFF';
                this.markAsModified();
            });
        }
        
        // 클리핑 마스크 버튼
        const maskBtns = document.querySelectorAll('.mask-btn');
        maskBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const maskType = btn.getAttribute('data-mask');
                if (maskType === 'remove') {
                    this.advancedManager.removeClippingMask();
                } else {
                    this.advancedManager.applyClippingMask(maskType);
                }
                this.markAsModified();
            });
        });
        
        // 템플릿 버튼
        const templateBtns = document.querySelectorAll('.template-btn');
        templateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const templateId = btn.getAttribute('data-template');
                this.advancedManager.applyTemplate(templateId);
                this.markAsModified();
            });
        });
        
        // 페이지 추가 버튼
        const addPageBtn = document.getElementById('addPageBtn');
        if (addPageBtn) {
            addPageBtn.addEventListener('click', () => {
                this.advancedManager.addPage();
                this.updatePageIndicator();
                this.markAsModified();
            });
        }
        
        // 페이지 네비게이션
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                const currentIndex = this.advancedManager.currentPageIndex;
                if (currentIndex > 0) {
                    this.advancedManager.switchPage(currentIndex - 1);
                    this.updatePageIndicator();
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const currentIndex = this.advancedManager.currentPageIndex;
                const totalPages = this.advancedManager.pages.length;
                if (currentIndex < totalPages - 1) {
                    this.advancedManager.switchPage(currentIndex + 1);
                    this.updatePageIndicator();
                }
            });
        }
    }
    
    /**
     * 페이지 인디케이터 업데이트
     */
    updatePageIndicator() {
        const pageIndicator = document.getElementById('pageIndicator');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        if (pageIndicator && this.advancedManager) {
            const current = this.advancedManager.currentPageIndex + 1;
            const total = this.advancedManager.pages.length;
            pageIndicator.textContent = `${current} / ${total}`;
            
            if (prevPageBtn) {
                prevPageBtn.disabled = (current === 1);
            }
            if (nextPageBtn) {
                nextPageBtn.disabled = (current === total);
            }
        }
    }
    
    /**
     * 책 배경 이미지 로드
     */
    loadBookBackground() {
        console.log('AlbumEditor: Loading book background...');
        
        // 책 배경 이미지 URL
        const bookImageUrl = '../src/assets/images/album-create-bg.jpg';
        
        // 이미지 로드
        fabric.Image.fromURL(bookImageUrl, (img) => {
            if (!img) {
                console.warn('AlbumEditor: Failed to load book background, using default');
                this.createDefaultBackground();
                return;
            }
            
            // 캔버스 크기에 맞게 이미지 스케일 조정
            const scaleX = this.canvas.width / img.width;
            const scaleY = this.canvas.height / img.height;
            const scale = Math.max(scaleX, scaleY);
            
            img.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                left: this.canvas.width / 2,
                top: this.canvas.height / 2,
                selectable: false,
                evented: false,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true
            });
            
            // 배경으로 설정
            this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
            this.currentAlbum.background = bookImageUrl;
            
            console.log('AlbumEditor: Book background loaded successfully');
        }, {
            crossOrigin: 'anonymous'
        });
    }
    
    /**
     * 기본 배경 생성 (이미지 로드 실패 시)
     */
    createDefaultBackground() {
        // 책 페이지 모양의 기본 배경 생성
        const leftPage = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.canvas.width / 2,
            height: this.canvas.height,
            fill: '#FFFEF7',
            selectable: false,
            evented: false
        });
        
        const rightPage = new fabric.Rect({
            left: this.canvas.width / 2,
            top: 0,
            width: this.canvas.width / 2,
            height: this.canvas.height,
            fill: '#FFFEF7',
            selectable: false,
            evented: false
        });
        
        // 중앙 접힌 선
        const centerLine = new fabric.Line(
            [this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height],
            {
                stroke: '#E0E0E0',
                strokeWidth: 2,
                selectable: false,
                evented: false
            }
        );
        
        // 그림자 효과
        const shadow = new fabric.Rect({
            left: this.canvas.width / 2 - 10,
            top: 0,
            width: 20,
            height: this.canvas.height,
            fill: new fabric.Gradient({
                type: 'linear',
                coords: { x1: 0, y1: 0, x2: 20, y2: 0 },
                colorStops: [
                    { offset: 0, color: 'rgba(0,0,0,0.05)' },
                    { offset: 0.5, color: 'rgba(0,0,0,0.1)' },
                    { offset: 1, color: 'rgba(0,0,0,0.05)' }
                ]
            }),
            selectable: false,
            evented: false
        });
        
        const group = new fabric.Group([leftPage, rightPage, shadow, centerLine], {
            selectable: false,
            evented: false
        });
        
        this.canvas.setBackgroundImage(group, this.canvas.renderAll.bind(this.canvas));
        console.log('AlbumEditor: Default background created');
    }
    
    /**
     * 객체 선택 이벤트
     */
    onObjectSelected(event) {
        const selectedObject = event.selected[0];
        console.log('AlbumEditor: Object selected', selectedObject.type);
        
        // 이미지 객체 선택 시 우측 사이드바 효과 탭 표시
        if (selectedObject.type === 'image') {
            this.handleRightSidebarToggle('image');
        }
        
        // 하단 컨트롤 패널 제거됨
    }
    
    /**
     * 객체 선택 해제 이벤트
     */
    onObjectDeselected() {
        console.log('AlbumEditor: Object deselected');
        
        // 하단 패널 제거됨
    }
    
    // 컨트롤 패널 관련 함수들 제거됨 (하단 패널 제거로 인해 불필요)
    

    
    /**
     * 이미지 컨트롤 생성
     */
    createImageControls(object) {
        return `
            <div class="control-group">
                <label class="control-label">불투명도</label>
                <input type="range" class="control-input" id="opacityInput" 
                       value="${object.opacity * 100}" min="0" max="100" step="1">
                <span class="control-value">${Math.round(object.opacity * 100)}%</span>
            </div>
            <div class="control-group">
                <button class="control-btn delete-btn" id="deleteObjectBtn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
    
    /**
     * 기본 컨트롤 생성
     */
    createBasicControls(object) {
        return `
            <div class="control-group">
                <label class="control-label">불투명도</label>
                <input type="range" class="control-input" id="opacityInput" 
                       value="${object.opacity * 100}" min="0" max="100" step="1">
                <span class="control-value">${Math.round(object.opacity * 100)}%</span>
            </div>
            <div class="control-group">
                <button class="control-btn delete-btn" id="deleteObjectBtn">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            </div>
        `;
    }
    
    /**
     * 텍스트 컨트롤 이벤트 바인딩
     */
    bindTextControlEvents(object) {
        // 폰트 크기
        const fontSizeInput = document.getElementById('fontSizeInput');
        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', (e) => {
                object.set('fontSize', parseInt(e.target.value));
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 폰트 패밀리
        const fontFamilyInput = document.getElementById('fontFamilyInput');
        if (fontFamilyInput) {
            fontFamilyInput.value = object.fontFamily;
            fontFamilyInput.addEventListener('change', (e) => {
                object.set('fontFamily', e.target.value);
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 텍스트 색상
        const textColorInput = document.getElementById('textColorInput');
        if (textColorInput) {
            textColorInput.addEventListener('input', (e) => {
                object.set('fill', e.target.value);
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 폰트 굵기
        const fontWeightInput = document.getElementById('fontWeightInput');
        if (fontWeightInput) {
            fontWeightInput.addEventListener('change', (e) => {
                object.set('fontWeight', e.target.value);
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 텍스트 정렬
        const textAlignInput = document.getElementById('textAlignInput');
        if (textAlignInput) {
            textAlignInput.addEventListener('change', (e) => {
                object.set('textAlign', e.target.value);
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 행간
        const lineHeightInput = document.getElementById('lineHeightInput');
        if (lineHeightInput) {
            lineHeightInput.addEventListener('input', (e) => {
                object.set('lineHeight', parseFloat(e.target.value));
                const valueSpan = lineHeightInput.nextElementSibling;
                if (valueSpan) valueSpan.textContent = parseFloat(e.target.value).toFixed(1);
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 자간
        const charSpacingInput = document.getElementById('charSpacingInput');
        if (charSpacingInput) {
            charSpacingInput.addEventListener('input', (e) => {
                object.set('charSpacing', parseInt(e.target.value));
                const valueSpan = charSpacingInput.nextElementSibling;
                if (valueSpan) valueSpan.textContent = e.target.value;
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 그림자
        const shadowCheckbox = document.getElementById('shadowCheckbox');
        const shadowColorInput = document.getElementById('shadowColorInput');
        if (shadowCheckbox && shadowColorInput) {
            shadowCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    object.set('shadow', new fabric.Shadow({
                        color: shadowColorInput.value,
                        blur: 10,
                        offsetX: 3,
                        offsetY: 3
                    }));
                    shadowColorInput.disabled = false;
                } else {
                    object.set('shadow', null);
                    shadowColorInput.disabled = true;
                }
                this.canvas.renderAll();
                this.markAsModified();
            });
            
            shadowColorInput.addEventListener('change', (e) => {
                if (object.shadow) {
                    object.shadow.color = e.target.value;
                    this.canvas.renderAll();
                    this.markAsModified();
                }
            });
        }
        
        // 외곽선 굵기
        const strokeWidthInput = document.getElementById('strokeWidthInput');
        if (strokeWidthInput) {
            strokeWidthInput.addEventListener('input', (e) => {
                object.set('strokeWidth', parseInt(e.target.value));
                const valueSpan = strokeWidthInput.nextElementSibling;
                if (valueSpan) valueSpan.textContent = e.target.value + 'px';
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        // 외곽선 색상
        const strokeColorInput = document.getElementById('strokeColorInput');
        if (strokeColorInput) {
            strokeColorInput.addEventListener('change', (e) => {
                object.set('stroke', e.target.value);
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
        
        this.bindDeleteButton();
    }
    
    /**
     * 이미지 컨트롤 이벤트 바인딩
     */
    bindImageControlEvents(object) {
        this.bindOpacityControl(object);
        this.bindDeleteButton();
    }
    
    /**
     * 기본 컨트롤 이벤트 바인딩
     */
    bindBasicControlEvents(object) {
        this.bindOpacityControl(object);
        this.bindDeleteButton();
    }
    
    /**
     * 불투명도 컨트롤 바인딩
     */
    bindOpacityControl(object) {
        const opacityInput = document.getElementById('opacityInput');
        const opacityValue = document.querySelector('.control-value');
        
        if (opacityInput) {
            opacityInput.addEventListener('input', (e) => {
                const opacity = parseInt(e.target.value) / 100;
                object.set('opacity', opacity);
                if (opacityValue) {
                    opacityValue.textContent = `${e.target.value}%`;
                }
                this.canvas.renderAll();
                this.markAsModified();
            });
        }
    }
    
    /**
     * 삭제 버튼 바인딩
     */
    bindDeleteButton() {
        const deleteBtn = document.getElementById('deleteObjectBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject) {
                    this.canvas.remove(activeObject);
                    this.canvas.renderAll();
                    this.markAsModified();
                }
            });
        }
    }
    
    /**
     * RGB를 HEX로 변환
     */
    rgbToHex(color) {
        if (typeof color === 'string' && color.startsWith('#')) {
            return color;
        }
        
        if (typeof color === 'string' && color.startsWith('rgb')) {
            const rgb = color.match(/\d+/g);
            const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
            const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
            const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        }
        
        return '#333333';
    }
    
    /**
     * 컨트롤 패널 초기화
     */
    resetControlPanel() {
        const controlPanel = document.getElementById('controlPanel');
        
        // 그리기 모드가 활성화되어 있으면 그리기 컨트롤 표시
        if (this.drawingManager && this.drawingManager.isDrawingMode) {
            controlPanel.innerHTML = this.createDrawingControls();
            this.bindDrawingControlEvents();
        } else {
            controlPanel.innerHTML = '<p class="no-selection">객체를 선택하거나 그리기 모드를 활성화하세요</p>';
        }
    }
    
    /**
     * 그리기 컨트롤 생성
     */
    createDrawingControls() {
        return `
            <div class="control-group">
                <label class="control-label">브러시 색상</label>
                <input type="color" class="control-input" id="bottomBrushColor" 
                       value="${this.drawingManager.brushColor}">
            </div>
            <div class="control-group">
                <label class="control-label">브러시 굵기</label>
                <input type="range" class="control-input" id="bottomBrushWidth" 
                       value="${this.drawingManager.brushWidth}" min="1" max="50" step="1">
                <span class="control-value">${this.drawingManager.brushWidth}px</span>
            </div>
            <div class="control-group">
                <button class="control-btn" id="bottomPenBtn">
                    <i class="fas fa-pen"></i> 펜
                </button>
            </div>
            <div class="control-group">
                <button class="control-btn" id="bottomEraserBtn">
                    <i class="fas fa-eraser"></i> 지우개
                </button>
            </div>
        `;
    }
    
    /**
     * 그리기 컨트롤 이벤트 바인딩
     */
    bindDrawingControlEvents() {
        const brushColor = document.getElementById('bottomBrushColor');
        const brushWidth = document.getElementById('bottomBrushWidth');
        const penBtn = document.getElementById('bottomPenBtn');
        const eraserBtn = document.getElementById('bottomEraserBtn');
        
        if (brushColor) {
            brushColor.addEventListener('change', (e) => {
                this.drawingManager.setBrushColor(e.target.value);
            });
        }
        
        if (brushWidth) {
            brushWidth.addEventListener('input', (e) => {
                this.drawingManager.setBrushWidth(e.target.value);
                const valueSpan = brushWidth.nextElementSibling;
                if (valueSpan) valueSpan.textContent = e.target.value + 'px';
            });
        }
        
        if (penBtn) {
            penBtn.addEventListener('click', () => {
                this.drawingManager.enablePenMode();
            });
        }
        
        if (eraserBtn) {
            eraserBtn.addEventListener('click', () => {
                this.drawingManager.enableEraserMode();
            });
        }
    }
    
    /**
     * 변경사항 표시
     */
    markAsModified() {
        this.currentAlbum.lastModified = Date.now();
    }
    
    /**
     * 저장되지 않은 변경사항 확인
     */
    hasUnsavedChanges() {
        if (!this.currentAlbum.lastModified) return false;
        if (!this.currentAlbum.lastSaved) return true;
        return this.currentAlbum.lastModified > this.currentAlbum.lastSaved;
    }
    
    /**
     * 앨범 저장
     */
    saveAlbum() {
        console.log('AlbumEditor: Saving album...');
        
        try {
            // 캔버스 데이터를 JSON으로 변환
            const albumData = {
                id: this.currentAlbum.id || this.generateAlbumId(),
                canvasData: this.canvas.toJSON(),
                thumbnail: this.canvas.toDataURL({
                    format: 'png',
                    quality: 0.8,
                    multiplier: 0.2
                }),
                createdAt: this.currentAlbum.createdAt || Date.now(),
                updatedAt: Date.now()
            };
            
            // 로컬 스토리지에 저장
            this.saveToLocalStorage(albumData);
            
            this.currentAlbum.lastSaved = Date.now();
            this.currentAlbum.id = albumData.id;
            
            alert('앨범이 저장되었습니다!');
            console.log('AlbumEditor: Album saved successfully', albumData.id);
            
        } catch (error) {
            console.error('AlbumEditor: Failed to save album', error);
            alert('앨범 저장에 실패했습니다. 다시 시도해주세요.');
        }
    }
    
    /**
     * 로컬 스토리지에 저장
     */
    saveToLocalStorage(albumData) {
        // 기존 앨범 목록 가져오기
        const albums = this.getAlbumsFromStorage();
        
        // 기존 앨범 업데이트 또는 새 앨범 추가
        const existingIndex = albums.findIndex(a => a.id === albumData.id);
        if (existingIndex >= 0) {
            albums[existingIndex] = albumData;
        } else {
            albums.push(albumData);
        }
        
        // 저장
        localStorage.setItem('pajuAlbums', JSON.stringify(albums));
        
        // 서버 연동을 위한 준비 (추후 구현)
        this.prepareForServerSync(albumData);
    }
    
    /**
     * 로컬 스토리지에서 앨범 목록 가져오기
     */
    getAlbumsFromStorage() {
        const data = localStorage.getItem('pajuAlbums');
        return data ? JSON.parse(data) : [];
    }
    
    /**
     * 서버 동기화 준비 (추후 구현)
     */
    prepareForServerSync(albumData) {
        // 서버 API 엔드포인트 준비
        // POST /api/albums 또는 PUT /api/albums/:id
        console.log('AlbumEditor: Prepared for server sync', albumData.id);
    }
    
    /**
     * 앨범 ID 생성
     */
    generateAlbumId() {
        return `album_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 앨범 불러기
     */
    loadAlbum(albumId) {
        console.log('AlbumEditor: Loading album...', albumId);
        
        const albums = this.getAlbumsFromStorage();
        const album = albums.find(a => a.id === albumId);
        
        if (album) {
            this.canvas.loadFromJSON(album.canvasData, () => {
                this.canvas.renderAll();
                this.currentAlbum = {
                    id: album.id,
                    createdAt: album.createdAt,
                    lastSaved: album.updatedAt
                };
                console.log('AlbumEditor: Album loaded successfully');
            });
        }
    }

    /**
     * 우측 사이드바 토글 처리
     */
    handleRightSidebarToggle(type) {
        const rightSidebar = document.querySelector('.right-sidebar');
        const layersTab = document.getElementById('layersTab');
        const effectsTab = document.getElementById('effectsTab');
        const textTab = document.getElementById('textTab');
        const stickerTab = document.getElementById('stickerTab');
        const shapesTab = document.getElementById('shapesTab');
        const drawingTab = document.getElementById('drawingTab');
        
        if (!rightSidebar) return;
        
        // 모든 탭 비활성화
        const allTabs = [layersTab, effectsTab, textTab, stickerTab, shapesTab, drawingTab];
        allTabs.forEach(tab => {
            if (tab) tab.classList.remove('active');
        });
        
        // 버튼 타입에 따라 처리
        switch(type) {
            case 'layers':
                if (layersTab) layersTab.classList.add('active');
                break;
            case 'image':
                if (effectsTab) effectsTab.classList.add('active');
                break;
            case 'text':
                if (textTab) textTab.classList.add('active');
                break;
            case 'sticker':
                if (stickerTab) stickerTab.classList.add('active');
                break;
            case 'shapes':
                if (shapesTab) shapesTab.classList.add('active');
                break;
            case 'drawing':
                if (drawingTab) drawingTab.classList.add('active');
                break;
            default:
                if (layersTab) layersTab.classList.add('active');
        }
    }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Fabric.js 로드 확인
    if (typeof fabric === 'undefined') {
        console.error('AlbumEditor: Fabric.js is not loaded!');
        return;
    }
    
    // 에디터 인스턴스 생성
    window.albumEditor = new AlbumEditor();
});
