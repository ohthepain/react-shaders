import { useRef, useEffect } from 'react';
import { useStore } from './store';

export const EffectsView = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { controlSettings } = useStore();

    useEffect(() => {
        console.log('controlSettings changed');
    }, [controlSettings]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) {
                console.error('Error creating shader');
                return null;
            }
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
            const program = gl.createProgram();
            if (!program) {
                console.error('Error creating program');
                return null;
            }
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Error linking program:', gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            return program;
        }

        type FrameBufferObject = {
            framebuffer: WebGLFramebuffer;
            texture: WebGLTexture;
        };

        function createFramebuffer(gl: WebGLRenderingContext, width: number, height: number) : FrameBufferObject | null {
            const framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            if (!framebuffer || !texture || gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                console.error('Error creating framebuffer or texture');
                return null;
            }

            return { framebuffer, texture };
        }

        // WebGL initialization and rendering logic here...

        // First Shader Program
        const vertexShaderSource1 = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource1 = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            void main() {
                vec2 st = gl_FragCoord.xy / u_resolution;
                st = st * 2.0;
                float dist = length(st);
                float color = 0.5 + 0.5 * cos(20.0 * dist - u_time);
                gl_FragColor = vec4(color, 0, 0, 1.0);
            }
        `;

        const vertexShader1 = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource1);
        const fragmentShader1 = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource1);
        if (!vertexShader1 || !fragmentShader1) {
            console.error('Error creating shaders');
            return;
        }
        const program1 = createProgram(gl, vertexShader1, fragmentShader1);
        if (!program1) {
            console.error('Error creating program1');
            return;
        }

        // Second Shader Program
        const vertexShaderSource2 = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource2 = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            void main() {
                vec2 st = gl_FragCoord.xy / u_resolution;
                st = st * -2.0 + 2.0;
                float dist = length(st);
                float color = 0.5 + 0.5 * cos(20.0 * dist - u_time);
                gl_FragColor = vec4(0, color, 0, 1.0);
            }
        `;

        const vertexShader2: WebGLShader | null = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource2);
        const fragmentShader2 = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource2);
        if (!vertexShader2 || !fragmentShader2) {
            console.error('Error creating shaders');
            return;
        }
        const program2 = createProgram(gl, vertexShader2, fragmentShader2);
        if (!program2) {
            console.error('Error creating program2');
            return;
        }

        // Final Pass Shader Program
        const vertexShaderSourceFinal = `
            attribute vec4 a_position;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = a_position;
                v_texCoord = a_position.xy * 0.5 + 0.5;
            }
        `;

        const fragmentShaderSourceFinal = `
            precision mediump float;
            uniform sampler2D u_texture1;
            uniform sampler2D u_texture2;
            varying vec2 v_texCoord;
            void main() {
                vec4 color1 = texture2D(u_texture1, v_texCoord);
                vec4 color2 = texture2D(u_texture2, v_texCoord);
                // gl_FragColor = mix(color1, color2, 0.5); // Simple blend
                // gl_FragColor = vec4(1.0) - (vec4(1.0) - color1) * (vec4(1.0) - color2);
                gl_FragColor = vec4(max(color1[0], color2[0]), max(color1[1], color2[1]), max(color1[2], color2[2]), 1.0);
            }
        `;

        const vertexShaderFinal = createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceFinal);
        if (!vertexShaderFinal) {
            console.error('Error creating vertex shaderFinal');
            return;
        }
        const fragmentShaderFinal = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceFinal);
        if (!fragmentShaderFinal) {
            console.error('Error creating fragment shaderFinal');
            return;
        }
        const programFinal = createProgram(gl, vertexShaderFinal, fragmentShaderFinal);
        if (!programFinal) {
            console.error('Error creating programFinal');
            return;
        }

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [
            -1, -1,
            -1, 1,
            1, -1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const framebuffer1 : FrameBufferObject | null = createFramebuffer(gl, gl.canvas.width, gl.canvas.height);
        const framebuffer2 : FrameBufferObject | null = createFramebuffer(gl, gl.canvas.width, gl.canvas.height);
        if (!framebuffer1 || !framebuffer2) {
            console.error('Error creating framebuffers');
            return;
        }

        const resolutionLocation1: WebGLUniformLocation | null = gl.getUniformLocation(program1, 'u_resolution');
        const timeLocation1: WebGLUniformLocation | null = gl.getUniformLocation(program1, 'u_time');

        const resolutionLocation2: WebGLUniformLocation | null = gl.getUniformLocation(program2, 'u_resolution');
        const timeLocation2: WebGLUniformLocation | null = gl.getUniformLocation(program2, 'u_time');

        const texture1Location: WebGLUniformLocation | null = gl.getUniformLocation(programFinal, 'u_texture1');
        const texture2Location: WebGLUniformLocation | null = gl.getUniformLocation(programFinal, 'u_texture2');
        if (!resolutionLocation1 || !timeLocation1 || !resolutionLocation2 || !timeLocation2 || !texture1Location || !texture2Location) {
            console.error('Error getting uniform locations');
            return;
        }

        function render(time: number) {
            time *= 0.001; // convert to seconds

            if (!gl || !program1 || !program2 || !programFinal || !framebuffer1 || !framebuffer2 || !positionBuffer || !resolutionLocation1 || !timeLocation1 || !resolutionLocation2 || !timeLocation2 || !texture1Location || !texture2Location) {
                return;
            }

            // gl.uniform1f(osc1Hue, controlSettings.oscillator1.hue);
            // gl.uniform1f(osc1Saturation, controlSettings.oscillator1.saturation);
            // gl.uniform1f(osc1, controlSettings.oscillator1.value);    

            // Draw first program to framebuffer1
            // drawScene(gl, program1, resolutionLocation1, timeLocation1, time, framebuffer1.framebuffer, positionBuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer1.framebuffer);
            gl.useProgram(program1);
            gl.uniform2f(resolutionLocation1, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeLocation1, time);
        
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
        
            var positionLocation = gl.getAttribLocation(program1, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


            // Draw second program to framebuffer2
            // drawScene(gl, program2, resolutionLocation2, timeLocation2, time, framebuffer2.framebuffer, positionBuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer2.framebuffer);
            gl.useProgram(program2);
            gl.uniform2f(resolutionLocation2, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeLocation2, time);
        
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
        
            positionLocation = gl.getAttribLocation(program2, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


            // Final pass: blend the two textures
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.useProgram(programFinal);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, framebuffer1.texture);
            gl.uniform1i(texture1Location, 0);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, framebuffer2.texture);
            gl.uniform1i(texture2Location, 1);

            positionLocation = gl.getAttribLocation(programFinal, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }, []);

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>;
};
