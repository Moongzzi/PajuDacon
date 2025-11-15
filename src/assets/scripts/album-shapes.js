/**
 * Album Shapes Manager
 * 도형 그리기 기능
 */

class AlbumShapesManager {
    constructor(canvas, editor) {
        this.canvas = canvas;
        this.editor = editor;
        
        this.init();
    }
    
    /**
     * 초기화
     */
    init() {
        console.log('ShapesManager: Initializing...');
    }
    
    /**
     * 사각형 추가
     */
    addRectangle() {
        const rect = new fabric.Rect({
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            width: 150,
            height: 100,
            fill: '#007bff',
            stroke: '#0056b3',
            strokeWidth: 2,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(rect);
        this.canvas.setActiveObject(rect);
        this.canvas.renderAll();
        console.log('ShapesManager: Rectangle added');
    }
    
    /**
     * 원 추가
     */
    addCircle() {
        const circle = new fabric.Circle({
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            radius: 60,
            fill: '#28a745',
            stroke: '#1e7e34',
            strokeWidth: 2,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(circle);
        this.canvas.setActiveObject(circle);
        this.canvas.renderAll();
        console.log('ShapesManager: Circle added');
    }
    
    /**
     * 삼각형 추가
     */
    addTriangle() {
        const triangle = new fabric.Triangle({
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            width: 120,
            height: 120,
            fill: '#ffc107',
            stroke: '#ff9800',
            strokeWidth: 2,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(triangle);
        this.canvas.setActiveObject(triangle);
        this.canvas.renderAll();
        console.log('ShapesManager: Triangle added');
    }
    
    /**
     * 별 추가
     */
    addStar() {
        const points = this.createStarPoints(5, 50, 25);
        const star = new fabric.Polygon(points, {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fill: '#dc3545',
            stroke: '#c82333',
            strokeWidth: 2,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(star);
        this.canvas.setActiveObject(star);
        this.canvas.renderAll();
        console.log('ShapesManager: Star added');
    }
    
    /**
     * 하트 추가
     */
    addHeart() {
        const heartPath = 'M 50,30 C 50,10 30,0 15,15 C 0,30 0,50 25,75 L 50,100 L 75,75 C 100,50 100,30 85,15 C 70,0 50,10 50,30 Z';
        
        const heart = new fabric.Path(heartPath, {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fill: '#e83e8c',
            stroke: '#d63384',
            strokeWidth: 2,
            scaleX: 1,
            scaleY: 1,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(heart);
        this.canvas.setActiveObject(heart);
        this.canvas.renderAll();
        console.log('ShapesManager: Heart added');
    }
    
    /**
     * 선 추가
     */
    addLine() {
        const line = new fabric.Line([50, 50, 200, 50], {
            left: this.canvas.width / 2 - 75,
            top: this.canvas.height / 2,
            stroke: '#6c757d',
            strokeWidth: 3,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(line);
        this.canvas.setActiveObject(line);
        this.canvas.renderAll();
        console.log('ShapesManager: Line added');
    }
    
    /**
     * 화살표 추가
     */
    addArrow() {
        const points = [
            {x: 0, y: 0},
            {x: 150, y: 0},
            {x: 150, y: -15},
            {x: 180, y: 15},
            {x: 150, y: 45},
            {x: 150, y: 30},
            {x: 0, y: 30}
        ];
        
        const arrow = new fabric.Polygon(points, {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fill: '#17a2b8',
            stroke: '#138496',
            strokeWidth: 2,
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#007bff',
            cornerColor: '#007bff',
            cornerStyle: 'circle'
        });
        
        this.canvas.add(arrow);
        this.canvas.setActiveObject(arrow);
        this.canvas.renderAll();
        console.log('ShapesManager: Arrow added');
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
}
