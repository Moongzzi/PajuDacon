/**
 * Album Advanced Features Manager
 * 클리핑 마스크, 가이드라인, 템플릿, 페이지 관리
 */

class AlbumAdvancedManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        
        // 페이지 관리
        this.pages = [
            { id: 1, name: '페이지 1', data: null }
        ];
        this.currentPageIndex = 0;
        
        // 가이드라인
        this.guidelines = {
            enabled: true,
            centerX: null,
            centerY: null,
            snapDistance: 10
        };
        
        // 템플릿 (추후 확장 가능)
        this.templates = [
            {
                id: 'blank',
                name: '빈 페이지',
                thumbnail: null,
                objects: []
            },
            {
                id: 'twoColumn',
                name: '2단 레이아웃',
                thumbnail: null,
                objects: [
                    { type: 'rect', left: 50, top: 50, width: 500, height: 500, fill: 'transparent', stroke: '#CCC' },
                    { type: 'rect', left: 650, top: 50, width: 500, height: 500, fill: 'transparent', stroke: '#CCC' }
                ]
            },
            {
                id: 'grid',
                name: '그리드 레이아웃',
                thumbnail: null,
                objects: [
                    { type: 'rect', left: 50, top: 50, width: 350, height: 250, fill: 'transparent', stroke: '#CCC' },
                    { type: 'rect', left: 450, top: 50, width: 350, height: 250, fill: 'transparent', stroke: '#CCC' },
                    { type: 'rect', left: 850, top: 50, width: 300, height: 250, fill: 'transparent', stroke: '#CCC' },
                    { type: 'rect', left: 50, top: 350, width: 550, height: 200, fill: 'transparent', stroke: '#CCC' },
                    { type: 'rect', left: 650, top: 350, width: 500, height: 200, fill: 'transparent', stroke: '#CCC' }
                ]
            }
        ];
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('AdvancedManager: Initializing...');
        this.initGuidelines();
    }
    
    /**
     * 가이드라인 초기화
     */
    initGuidelines() {
        if (!this.guidelines.enabled) return;
        
        this.canvas.on('object:moving', (e) => this.showGuidelines(e));
        this.canvas.on('object:modified', () => this.hideGuidelines());
    }
    
    /**
     * 가이드라인 표시
     */
    showGuidelines(e) {
        if (!this.guidelines.enabled) return;
        
        const obj = e.target;
        const canvasCenter = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        
        const objCenter = {
            x: obj.left + (obj.width * obj.scaleX) / 2,
            y: obj.top + (obj.height * obj.scaleY) / 2
        };
        
        // 중앙 정렬 스냅
        if (Math.abs(objCenter.x - canvasCenter.x) < this.guidelines.snapDistance) {
            obj.set({ left: canvasCenter.x - (obj.width * obj.scaleX) / 2 });
            this.drawGuideline('vertical', canvasCenter.x);
        }
        
        if (Math.abs(objCenter.y - canvasCenter.y) < this.guidelines.snapDistance) {
            obj.set({ top: canvasCenter.y - (obj.height * obj.scaleY) / 2 });
            this.drawGuideline('horizontal', canvasCenter.y);
        }
        
        this.canvas.renderAll();
    }
    
    /**
     * 가이드라인 그리기
     */
    drawGuideline(type, position) {
        this.hideGuidelines();
        
        if (type === 'vertical') {
            this.guidelines.centerX = new fabric.Line(
                [position, 0, position, this.canvas.height],
                {
                    stroke: '#00FF00',
                    strokeWidth: 1,
                    strokeDashArray: [5, 5],
                    selectable: false,
                    evented: false
                }
            );
            this.canvas.add(this.guidelines.centerX);
        } else if (type === 'horizontal') {
            this.guidelines.centerY = new fabric.Line(
                [0, position, this.canvas.width, position],
                {
                    stroke: '#00FF00',
                    strokeWidth: 1,
                    strokeDashArray: [5, 5],
                    selectable: false,
                    evented: false
                }
            );
            this.canvas.add(this.guidelines.centerY);
        }
        
        this.canvas.renderAll();
    }
    
    /**
     * 가이드라인 숨기기
     */
    hideGuidelines() {
        if (this.guidelines.centerX) {
            this.canvas.remove(this.guidelines.centerX);
            this.guidelines.centerX = null;
        }
        if (this.guidelines.centerY) {
            this.canvas.remove(this.guidelines.centerY);
            this.guidelines.centerY = null;
        }
        this.canvas.renderAll();
    }
    
    /**
     * 클리핑 마스크 적용
     */
    applyClippingMask(maskType = 'circle') {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject || activeObject.type !== 'image') {
            alert('이미지를 선택해주세요.');
            return;
        }
        
        let clipPath;
        const width = activeObject.width * activeObject.scaleX;
        const height = activeObject.height * activeObject.scaleY;
        
        switch(maskType) {
            case 'circle':
                clipPath = new fabric.Circle({
                    radius: Math.min(width, height) / 2,
                    originX: 'center',
                    originY: 'center'
                });
                break;
                
            case 'heart':
                const heartPath = 'M 50,30 C 50,10 30,0 15,15 C 0,30 0,50 25,75 L 50,100 L 75,75 C 100,50 100,30 85,15 C 70,0 50,10 50,30 Z';
                clipPath = new fabric.Path(heartPath, {
                    scaleX: width / 100,
                    scaleY: height / 100,
                    originX: 'center',
                    originY: 'center'
                });
                break;
                
            case 'star':
                const starPoints = this.createStarPoints(5, Math.min(width, height) / 2, Math.min(width, height) / 4);
                clipPath = new fabric.Polygon(starPoints, {
                    originX: 'center',
                    originY: 'center'
                });
                break;
                
            default:
                clipPath = new fabric.Circle({
                    radius: Math.min(width, height) / 2,
                    originX: 'center',
                    originY: 'center'
                });
        }
        
        activeObject.set({ clipPath: clipPath });
        this.canvas.renderAll();
        
        console.log('AdvancedManager: Clipping mask applied -', maskType);
    }
    
    /**
     * 클리핑 마스크 제거
     */
    removeClippingMask() {
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            alert('객체를 선택해주세요.');
            return;
        }
        
        activeObject.set({ clipPath: null });
        this.canvas.renderAll();
        
        console.log('AdvancedManager: Clipping mask removed');
    }
    
    /**
     * 별 포인트 생성
     */
    createStarPoints(numPoints, outerRadius, innerRadius) {
        const points = [];
        const step = Math.PI / numPoints;
        
        for (let i = 0; i < numPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * step - Math.PI / 2;
            points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        return points;
    }
    
    /**
     * 템플릿 적용
     */
    applyTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        
        if (!template) {
            console.warn('Template not found:', templateId);
            return;
        }
        
        // 현재 캔버스 내용 저장 (확인 후)
        if (this.canvas.getObjects().length > 0) {
            if (!confirm('현재 작업 내용이 삭제됩니다. 계속하시겠습니까?')) {
                return;
            }
        }
        
        this.canvas.clear();
        this.canvas.backgroundColor = '#FFFFFF';
        
        // 템플릿 객체 추가
        template.objects.forEach(objData => {
            if (objData.type === 'rect') {
                const rect = new fabric.Rect(objData);
                this.canvas.add(rect);
            }
        });
        
        this.canvas.renderAll();
        console.log('AdvancedManager: Template applied -', templateId);
    }
    
    /**
     * 페이지 추가
     */
    addPage() {
        // 현재 페이지 저장
        this.saveCurrentPage();
        
        // 새 페이지 추가
        const newPage = {
            id: this.pages.length + 1,
            name: `페이지 ${this.pages.length + 1}`,
            data: null
        };
        
        this.pages.push(newPage);
        this.currentPageIndex = this.pages.length - 1;
        
        // 캔버스 초기화
        this.canvas.clear();
        this.canvas.backgroundColor = '#FFFFFF';
        this.canvas.renderAll();
        
        console.log('AdvancedManager: New page added');
        return newPage;
    }
    
    /**
     * 페이지 전환
     */
    switchPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.pages.length) {
            console.warn('Invalid page index:', pageIndex);
            return;
        }
        
        // 현재 페이지 저장
        this.saveCurrentPage();
        
        // 페이지 전환
        this.currentPageIndex = pageIndex;
        const page = this.pages[pageIndex];
        
        // 캔버스 로드
        if (page.data) {
            this.canvas.loadFromJSON(page.data, () => {
                this.canvas.renderAll();
                console.log('AdvancedManager: Page loaded -', page.name);
            });
        } else {
            this.canvas.clear();
            this.canvas.backgroundColor = '#FFFFFF';
            this.canvas.renderAll();
        }
    }
    
    /**
     * 페이지 삭제
     */
    deletePage(pageIndex) {
        if (this.pages.length <= 1) {
            alert('최소 1개의 페이지가 필요합니다.');
            return;
        }
        
        if (pageIndex < 0 || pageIndex >= this.pages.length) {
            console.warn('Invalid page index:', pageIndex);
            return;
        }
        
        this.pages.splice(pageIndex, 1);
        
        // 현재 페이지 인덱스 조정
        if (this.currentPageIndex >= this.pages.length) {
            this.currentPageIndex = this.pages.length - 1;
        }
        
        this.switchPage(this.currentPageIndex);
        console.log('AdvancedManager: Page deleted');
    }
    
    /**
     * 현재 페이지 저장
     */
    saveCurrentPage() {
        const currentPage = this.pages[this.currentPageIndex];
        currentPage.data = this.canvas.toJSON();
    }
    
    /**
     * 모든 페이지 데이터 가져오기
     */
    getAllPages() {
        this.saveCurrentPage();
        return this.pages;
    }
}
