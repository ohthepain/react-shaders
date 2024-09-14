import { useRef, useEffect } from 'react';
import { ControlSettings } from './store';
import { cacheLfoValues } from './Lfo';
import { useStore } from './store';
import { ControllerId } from './Modulation';

export const EffectsView = ({ controlSettingsParm }: { controlSettingsParm: ControlSettings }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const controlSettingsRef = useRef(controlSettingsParm);
    const { controllerValues } = useStore();

    useEffect(() => {
        console.log(`EffectsView: controlSettings ${JSON.stringify(controlSettingsParm)}`);
        controlSettingsRef.current = controlSettingsParm;
    }, [controlSettingsParm]);

    useEffect(() => {
        console.log(`EffectsView: controllerValues ${JSON.stringify(controllerValues)}`);
    }, [controllerValues]);

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

        // WebGL initialization and rendering logic

        // First Shader Program
        const vertexShaderSource1 = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource1 = `
            precision mediump float;
            uniform vec3 u_color1;
            uniform float u_freq1;
            uniform float u_speed1;
            uniform float u_sharpen1;
            uniform vec2 u_center1;
            uniform vec2 u_resolution;
            uniform float u_time;

            void main() {
                vec2 st = (gl_FragCoord.xy - u_center1 * abs(u_center1) - u_resolution / 2.0) / u_resolution;
                st = st * u_freq1 * u_freq1;
                float dist = length(st);
                float a = 0.5 + 0.5 * cos(20.0 * dist - u_time * u_speed1 * u_freq1) * u_sharpen1 * u_sharpen1;
                gl_FragColor = vec4(u_color1, a);
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
            uniform vec3 u_color2;
            uniform float u_freq2;
            uniform float u_speed2;
            uniform float u_sharpen2;
            uniform vec2 u_center2;
            uniform vec2 u_resolution;
            uniform float u_time;
            void main() {
                vec2 st = (gl_FragCoord.xy - u_center2 * abs(u_center2) - u_resolution / 2.0) / u_resolution;
                st = st * u_freq2 * u_freq2;
                float dist = length(st);
                float a = 0.5 + 0.5 * cos(20.0 * dist - u_time * u_speed2 * u_freq2) * u_sharpen2 * u_sharpen2;
                gl_FragColor = vec4(u_color2, a);
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
            uniform float u_balance;
            uniform sampler2D u_texture1;
            uniform sampler2D u_texture2;
            varying vec2 v_texCoord;

            void main() {
                vec4 color1 = texture2D(u_texture1, v_texCoord);
                vec4 color2 = texture2D(u_texture2, v_texCoord);
                gl_FragColor = mix(color1, color2, u_balance); // Simple blend
                // gl_FragColor = vec4(1.0) - (vec4(1.0) - color1) * (vec4(1.0) - color2);
                // gl_FragColor = vec4(max(color1[0], color2[0]), max(color1[1], color2[1]), max(color1[2], color2[2]), u_balance);
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
            console.error('Error getting uniform locations 0');
            return;
        }

        // Get uniform locations
        const balanceLocation = gl.getUniformLocation(programFinal, 'u_balance');
        if (!balanceLocation) {
            console.error('Error getting uniform locations balance');
            return;
        }

        // Get uniform locations - osc 1
        const color1Location = gl.getUniformLocation(program1, 'u_color1');
        const freq1Location = gl.getUniformLocation(program1, 'u_freq1');
        const speed1Location = gl.getUniformLocation(program1, 'u_speed1');
        const sharpen1Location = gl.getUniformLocation(program1, 'u_sharpen1');
        const center1Location = gl.getUniformLocation(program1, 'u_center1');
        if (!color1Location || !freq1Location || !speed1Location || !sharpen1Location || !center1Location) {
            console.error('Error getting uniform locations osc 1');
            return;
        }

        // Get uniform locations - osc 2
        const color2Location = gl.getUniformLocation(program2, 'u_color2');
        const freq2Location = gl.getUniformLocation(program2, 'u_freq2');
        const speed2Location = gl.getUniformLocation(program2, 'u_speed2');
        const sharpen2Location = gl.getUniformLocation(program2, 'u_sharpen2');
        const center2Location = gl.getUniformLocation(program2, 'u_center2');
        if (!color2Location || !freq2Location || !speed2Location || !sharpen2Location || !center2Location) {
            console.error('Error getting uniform locations osc 2');
            return;
        }

        function render(time: number) {
            time *= 0.001; // convert to seconds

            if (!gl || !program1 || !program2 || !programFinal || !framebuffer1 || !framebuffer2 || !positionBuffer || !resolutionLocation1 || !timeLocation1 || !resolutionLocation2 || !timeLocation2 || !texture1Location || !texture2Location) {
                return;
            }

            const lfoValues: number[] = cacheLfoValues(time);

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

            // Set uniform values from controlSettings
            const r1 = parseInt(controlSettingsRef.current.oscillators[0].color.substring(1, 3), 16) / 255.0
            const g1 = parseInt(controlSettingsRef.current.oscillators[0].color.substring(3, 5), 16) / 255.0;
            const b1 = parseInt(controlSettingsRef.current.oscillators[0].color.substring(5, 7), 16) / 255.0;
            gl.uniform3f(color1Location, r1, g1, b1);
            var controllerValue = useStore.getState().controllerValues.oscillators[0].controllers[ControllerId.Freq];
            gl.uniform1f(freq1Location, controllerValue);
            controllerValue = useStore.getState().controllerValues.oscillators[0].controllers[ControllerId.Speed];
            gl.uniform1f(speed1Location, controllerValue);

            controllerValue = useStore.getState().controllerValues.oscillators[0].controllers[ControllerId.Sharp] * lfoValues[0];
            gl.uniform1f(sharpen1Location, controllerValue);

            var updatedCenter: [number, number] = [
                useStore.getState().controllerValues.oscillators[0].controllers[ControllerId.X],
                useStore.getState().controllerValues.oscillators[0].controllers[ControllerId.Y]
            ];
            gl.uniform2fv(center1Location, updatedCenter);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


            // Draw second program to framebuffer2
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

            // Set uniform values from controlSettings
            const r2 = parseInt(controlSettingsRef.current.oscillators[1].color.substring(1, 3), 16) / 255.0
            const g2 = parseInt(controlSettingsRef.current.oscillators[1].color.substring(3, 5), 16) / 255.0;
            const b2 = parseInt(controlSettingsRef.current.oscillators[1].color.substring(5, 7), 16) / 255.0;
            gl.uniform3f(color2Location, r2, g2, b2);
            controllerValue = useStore.getState().controllerValues.oscillators[1].controllers[ControllerId.Freq];
            gl.uniform1f(freq2Location, controllerValue);
            controllerValue = useStore.getState().controllerValues.oscillators[1].controllers[ControllerId.Speed];
            gl.uniform1f(speed2Location, controllerValue);

            controllerValue = useStore.getState().controllerValues.oscillators[1].controllers[ControllerId.Sharp];
            gl.uniform1f(sharpen2Location, controllerValue);

            updatedCenter = [
                useStore.getState().controllerValues.oscillators[1].controllers[ControllerId.X] + lfoValues[1] * 30,
                useStore.getState().controllerValues.oscillators[1].controllers[ControllerId.Y] + lfoValues[2] * 30
            ];
            gl.uniform2fv(center2Location, updatedCenter);

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

            gl.uniform1f(balanceLocation, controlSettingsRef.current.balance);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }, []);

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>;
};
