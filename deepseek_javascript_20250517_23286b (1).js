// Более сложная реализация интерактивного цветового круга
document.addEventListener('DOMContentLoaded', function() {
    const ColorWheel = function(elementId, options) {
        this.element = document.getElementById(elementId);
        this.options = Object.assign({
            size: 500,
            segments: 24,
            centerSize: 0.3,
            animationDuration: 1000,
            sensitivity: 0.8
        }, options);
        
        this.canvas = null;
        this.ctx = null;
        this.rotation = 0;
        this.targetRotation = 0;
        this.animationStart = null;
        this.isAnimating = false;
        this.currentSegment = null;
        this.hoveredSegment = null;
        
        this.init();
    };
    
    ColorWheel.prototype.init = function() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.size;
        this.canvas.height = this.options.size;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.element.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Add event listeners
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Initial draw
        this.draw();
        
        // Start animation loop
        requestAnimationFrame(this.animate.bind(this));
    };
    
    ColorWheel.prototype.draw = function() {
        const center = this.options.size / 2;
        const radius = center;
        const segmentAngle = 360 / this.options.segments;
        const centerRadius = radius * this.options.centerSize;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.options.size, this.options.size);
        
        // Draw segments
        for (let i = 0; i < this.options.segments; i++) {
            const startAngle = (i * segmentAngle + this.rotation) * Math.PI / 180;
            const endAngle = ((i + 1) * segmentAngle + this.rotation) * Math.PI / 180;
            
            // Check if this is the hovered segment
            const isHovered = this.hoveredSegment === i;
            const isCurrent = this.currentSegment === i;
            
            // Draw segment
            this.ctx.beginPath();
            this.ctx.moveTo(center, center);
            this.ctx.arc(center, center, radius, startAngle, endAngle);
            this.ctx.closePath();
            
            // Calculate color
            const hue = i * segmentAngle;
            const saturation = isHovered || isCurrent ? 90 : 80;
            const lightness = isHovered ? 70 : (isCurrent ? 65 : 60);
            
            this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            this.ctx.fill();
            
            // Add border for current segment
            if (isCurrent) {
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
        }
        
        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(center, center, centerRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw center text if current segment is selected
        if (this.currentSegment !== null) {
            const hue = this.currentSegment * segmentAngle;
            const color = `hsl(${hue}, 80%, 50%)`;
            
            this.ctx.fillStyle = color;
            this.ctx.font = `bold ${centerRadius * 0.4}px Montserrat, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Выбрать', center, center);
        } else {
            this.ctx.fillStyle = '#666666';
            this.ctx.font = `bold ${centerRadius * 0.3}px Montserrat, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Круг цветов', center, center);
        }
    };
    
    ColorWheel.prototype.handleMouseMove = function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.options.size / 2;
        const y = e.clientY - rect.top - this.options.size / 2;
        const distance = Math.sqrt(x * x + y * y);
        
        const centerRadius = this.options.size / 2 * this.options.centerSize;
        
        if (distance < centerRadius) {
            // Mouse is in center
            this.hoveredSegment = null;
        } else {
            // Calculate angle
            let angle = Math.atan2(y, x) * 180 / Math.PI + 180 - this.rotation;
            if (angle < 0) angle += 360;
            if (angle >= 360) angle -= 360;
            
            // Find segment
            const segment = Math.floor(angle / (360 / this.options.segments));
            this.hoveredSegment = segment;
            
            // Calculate target rotation for animation
            const segmentCenterAngle = (segment + 0.5) * (360 / this.options.segments);
            this.targetRotation = -segmentCenterAngle * this.options.sensitivity;
        }
        
        this.draw();
    };
    
    ColorWheel.prototype.handleClick = function() {
        if (this.hoveredSegment !== null) {
            this.currentSegment = this.hoveredSegment;
            this.draw();
            
            // Dispatch custom event
            const event = new CustomEvent('colorSelected', {
                detail: {
                    segment: this.currentSegment,
                    hue: this.currentSegment * (360 / this.options.segments)
                }
            });
            this.element.dispatchEvent(event);
        } else if (this.currentSegment !== null) {
            // Clicked in center with color selected - proceed to test
            window.location.href = '#demo-test';
        }
    };
    
    ColorWheel.prototype.handleMouseLeave = function() {
        this.hoveredSegment = null;
        this.targetRotation = 0;
        this.draw();
    };
    
    ColorWheel.prototype.animate = function(timestamp) {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animationStart = timestamp;
        }
        
        const progress = Math.min((timestamp - this.animationStart) / this.options.animationDuration, 1);
        this.rotation = this.rotation + (this.targetRotation - this.rotation) * progress;
        
        this.draw();
        
        if (progress < 1) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.isAnimating = false;
        }
    };
    
    // Initialize color wheel
    if (document.getElementById('interactiveWheel')) {
        const colorWheel = new ColorWheel('interactiveWheel', {
            size: 500,
            segments: 24,
            centerSize: 0.3,
            animationDuration: 800,
            sensitivity: 0.7
        });
        
        // Listen for color selection
        document.getElementById('interactiveWheel').addEventListener('colorSelected', function(e) {
            const hue = e.detail.hue;
            const color = `hsl(${hue}, 80%, 60%)`;
            document.querySelector('.wheel-tooltip').textContent = `Цвет: ${Math.round(hue)}°`;
            document.querySelector('.wheel-tooltip').style.color = color;
        });
    }
});