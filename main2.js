/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");



class ThreeJSContainer {
    scene;
    light;
    tennisBall;
    tennisWall;
    courtPlane;
    cannonWorld;
    cannonBallBody;
    cannonWallBody;
    cannonGroundBody;
    cannonRacketBody = null;
    groundMaterial;
    ballMaterial;
    wallMaterial;
    courtBoundaryMaterial;
    racketMaterialPhysics;
    boostedBallMaterial;
    defaultBallRestitution = 0.7;
    wallBallRestitution = 1.0;
    ballDirection = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0);
    ballSpeed = 0.5;
    wallWidth = 20;
    wallHeight = 15;
    wallDepth = 0.2;
    courtLength = 15;
    courtPlaneHeight;
    courtWidthSingles;
    courtWidthDoubles;
    serviceLineDistance = 6.40;
    centerMarkLength = 0.10;
    courtLineThickness = 0.05;
    frontBaselineZ;
    courtGroundY = -2.1;
    tennisBallRadius = 0.5;
    backBaselineZ;
    renderer;
    camera;
    orbitControls;
    tennisRacketModel = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
    mouseX = 0;
    racketMoveRangeX;
    initialRacketRotation = new three__WEBPACK_IMPORTED_MODULE_1__.Euler(0, Math.PI, Math.PI / 2, 'XYZ');
    targetRacketRotationYOffset = 0;
    currentRacketQuaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion().setFromEuler(new three__WEBPACK_IMPORTED_MODULE_1__.Euler(0, Math.PI, Math.PI / 2));
    hitCount = 0;
    constructor() {
        this.courtPlaneHeight = this.courtLength + 6;
        this.courtWidthSingles = this.wallWidth;
        this.courtWidthDoubles = this.wallWidth;
        this.racketMoveRangeX = this.wallWidth / 2 - 1;
    }
    createRendererDOM = (width, height, cameraPos) => {
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        this.renderer.shadowMap.enabled = true;
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        this.orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.25;
        this.orbitControls.enabled = true;
        this.initPhysics();
        this.createScene();
        this.renderer.setAnimationLoop((time) => {
            this.cannonWorld.step(1 / 60);
            if (this.cannonBallBody && this.tennisBall) {
                this.tennisBall.position.copy(this.cannonBallBody.position);
                this.tennisBall.quaternion.copy(this.cannonBallBody.quaternion);
            }
            if (this.tennisRacketModel && this.cannonRacketBody) {
                const targetX = this.mouseX * this.racketMoveRangeX;
                this.tennisRacketModel.position.x += (targetX - this.tennisRacketModel.position.x) * 0.3;
                const racketCurrentX = this.tennisRacketModel.position.x;
                const rotationFactor = 0.1;
                if (racketCurrentX < -0.5) {
                    this.targetRacketRotationYOffset = -(racketCurrentX + 0.5) * rotationFactor;
                }
                else if (racketCurrentX > 0.5) {
                    this.targetRacketRotationYOffset = -(racketCurrentX - 0.5) * rotationFactor;
                }
                else {
                    this.targetRacketRotationYOffset = 0;
                }
                const targetQuaternion = new three__WEBPACK_IMPORTED_MODULE_1__.Quaternion().setFromEuler(new three__WEBPACK_IMPORTED_MODULE_1__.Euler(this.initialRacketRotation.x, this.initialRacketRotation.y + this.targetRacketRotationYOffset, this.initialRacketRotation.z, this.initialRacketRotation.order));
                this.currentRacketQuaternion.slerp(targetQuaternion, 0.1);
                this.tennisRacketModel.quaternion.copy(this.currentRacketQuaternion);
                this.cannonRacketBody.position.copy(this.tennisRacketModel.position);
                this.cannonRacketBody.quaternion.copy(this.currentRacketQuaternion);
            }
            this.orbitControls.update();
            this.renderer.render(this.scene, this.camera);
        });
        this.renderer.domElement.style.cssFloat = "left";
        this.renderer.domElement.style.margin = "10px";
        this.renderer.domElement.tabIndex = 1;
        this.renderer.domElement.addEventListener('click', () => {
            this.renderer.domElement.focus();
            this.orbitControls.enabled = false;
        });
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        });
        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.orbitControls.enabled = true;
        });
        return this.renderer.domElement;
    };
    initPhysics = () => {
        this.cannonWorld = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World();
        this.cannonWorld.gravity.set(0, -9.82, 0);
        this.groundMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material("groundMaterial");
        this.ballMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material("ballMaterial");
        this.wallMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material("wallMaterial");
        this.courtBoundaryMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material("courtBoundaryMaterial");
        this.racketMaterialPhysics = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material("racketMaterialPhysics");
        this.boostedBallMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material("boostedBallMaterial");
        const groundBallContactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(this.groundMaterial, this.ballMaterial, {
            friction: 0.8,
            restitution: this.defaultBallRestitution
        });
        this.cannonWorld.addContactMaterial(groundBallContactMaterial);
        const wallBallContactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(this.wallMaterial, this.ballMaterial, {
            friction: 0.6,
            restitution: this.wallBallRestitution
        });
        this.cannonWorld.addContactMaterial(wallBallContactMaterial);
        const boundaryBallContactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(this.courtBoundaryMaterial, this.ballMaterial, {
            friction: 0.2,
            restitution: 2.0
        });
        this.cannonWorld.addContactMaterial(boundaryBallContactMaterial);
        const racketBallContactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(this.racketMaterialPhysics, this.ballMaterial, {
            friction: 0.1,
            restitution: 1.9
        });
        this.cannonWorld.addContactMaterial(racketBallContactMaterial);
        this.cannonWorld.addEventListener('collide', (event) => {
            const bodyA = event.bodyA;
            const bodyB = event.bodyB;
            if ((bodyA === this.cannonBallBody && bodyB === this.cannonWallBody) ||
                (bodyB === this.cannonBallBody && bodyA === this.cannonWallBody)) {
                console.log("Ball hit the wall!");
                this.hitCount++;
                console.log(`Wall Hits: ${this.hitCount}`);
            }
            else if ((bodyA === this.cannonBallBody && bodyB === this.cannonGroundBody) ||
                (bodyB === this.cannonBallBody && bodyA === this.cannonGroundBody)) {
                console.log("Ball hit the ground!");
            }
            else if ((bodyA === this.cannonBallBody && bodyB === this.cannonRacketBody) ||
                (bodyB === this.cannonBallBody && bodyA === this.cannonRacketBody)) {
                console.log("Ball hit the racket!");
            }
        });
    };
    updateHitCountDisplay = () => {
    };
    resetHitCount = () => {
        this.hitCount = 0;
        console.log(`Wall Hits: ${this.hitCount} (Reset)`); // リセット時もコンソールに表示
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        const wallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(this.wallWidth, this.wallHeight, this.wallDepth);
        const wallMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({
            color: 0x336699,
            roughness: 0.7,
            metalness: 0.1
        });
        this.tennisWall = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wallGeometry, wallMaterial);
        this.tennisWall.position.set(0, this.wallHeight / 2 - 2, -10);
        this.tennisWall.castShadow = true;
        this.tennisWall.receiveShadow = true;
        this.scene.add(this.tennisWall);
        const wallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(this.wallWidth / 2, this.wallHeight / 2, this.wallDepth / 2));
        this.cannonWallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(this.tennisWall.position.x, this.tennisWall.position.y, this.tennisWall.position.z),
            shape: wallShape,
            material: this.wallMaterial,
            type: cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body.STATIC
        });
        this.cannonWorld.addBody(this.cannonWallBody);
        this.backBaselineZ = this.tennisWall.position.z + this.wallDepth / 2 + this.courtLineThickness / 2 + 0.1;
        const courtPlaneGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(this.wallWidth, this.courtPlaneHeight);
        const courtPlaneMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x3cb371 });
        this.courtPlane = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(courtPlaneGeometry, courtPlaneMaterial);
        this.courtPlane.rotation.x = -Math.PI / 2;
        this.courtPlane.position.y = this.courtGroundY;
        this.courtPlane.position.z = this.tennisWall.position.z + this.wallDepth / 2 + this.courtLength / 2;
        this.courtPlane.receiveShadow = true;
        this.scene.add(this.courtPlane);
        const groundShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(this.wallWidth / 2, this.courtLineThickness / 2, this.courtPlaneHeight / 2));
        this.cannonGroundBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(this.courtPlane.position.x, this.courtPlane.position.y, this.courtPlane.position.z),
            shape: groundShape,
            material: this.groundMaterial,
            type: cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body.STATIC
        });
        this.cannonWorld.addBody(this.cannonGroundBody);
        const courtLineMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xffffff });
        const lineYPosition = this.courtGroundY + this.courtLineThickness / 2;
        const backBaselineLength = this.courtWidthSingles;
        const backBaselineGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(backBaselineLength, this.courtLineThickness, this.courtLineThickness);
        const backBaseline = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(backBaselineGeometry, courtLineMaterial);
        backBaseline.position.set(0, lineYPosition, this.backBaselineZ);
        this.scene.add(backBaseline);
        const serviceLineLength = this.courtWidthSingles;
        const serviceLineGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(serviceLineLength, this.courtLineThickness, this.courtLineThickness);
        const serviceLineFront = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(serviceLineGeometry, courtLineMaterial);
        const serviceLineZ = this.backBaselineZ + this.serviceLineDistance;
        serviceLineFront.position.set(0, lineYPosition, serviceLineZ);
        this.scene.add(serviceLineFront);
        const centerServiceLineLength = this.serviceLineDistance;
        const centerServiceLineGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(this.courtLineThickness, this.courtLineThickness, centerServiceLineLength);
        const centerServiceLine = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(centerServiceLineGeometry, courtLineMaterial);
        const centerServiceLineZ = (serviceLineZ + backBaseline.position.z) / 2;
        centerServiceLine.position.set(0, lineYPosition, centerServiceLineZ);
        this.scene.add(centerServiceLine);
        const sideLineLength = this.courtLength;
        const sideLineOffset = this.courtWidthSingles / 2;
        const sideLineGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(this.courtLineThickness, this.courtLineThickness, sideLineLength);
        const leftSideLine = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(sideLineGeometry, courtLineMaterial);
        leftSideLine.position.set(-sideLineOffset, lineYPosition, this.backBaselineZ + this.courtLength / 2);
        this.scene.add(leftSideLine);
        const rightSideLine = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(sideLineGeometry, courtLineMaterial);
        rightSideLine.position.set(sideLineOffset, lineYPosition, this.backBaselineZ + this.courtLength / 2);
        this.scene.add(rightSideLine);
        this.frontBaselineZ = this.backBaselineZ + this.courtLength - this.courtLineThickness / 2;
        const netLineColor = 0xffffff;
        const netLineThickness = 0.05;
        const netLineMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: netLineColor });
        const netHeight = this.wallHeight / 3;
        const horizontalNetLineGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(this.wallWidth, netLineThickness, netLineThickness);
        const horizontalNetLine = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(horizontalNetLineGeometry, netLineMaterial);
        horizontalNetLine.position.set(0, netHeight - 2, this.tennisWall.position.z + this.wallDepth / 2 + netLineThickness / 2);
        horizontalNetLine.castShadow = true;
        horizontalNetLine.receiveShadow = true;
        this.scene.add(horizontalNetLine);
        const numVerticalNetLines = 5;
        const verticalNetLineLength = this.wallHeight - netHeight;
        const verticalNetLineTopOffset = this.wallHeight / 2 - 2;
        for (let i = 0; i < numVerticalNetLines; i++) {
            const lineGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(netLineThickness, verticalNetLineLength, netLineThickness);
            const line = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(lineGeometry, netLineMaterial);
            const xPos = (i / (numVerticalNetLines - 1)) * this.wallWidth - (this.wallWidth / 2);
            line.position.set(xPos, netHeight / 2 + verticalNetLineTopOffset, this.tennisWall.position.z + this.wallDepth / 2 + netLineThickness / 2);
            line.castShadow = true;
            line.receiveShadow = true;
            this.scene.add(line);
        }
        const frameMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x8A2BE2 });
        const stringMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x00FF00 });
        const gripMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xFFFFFF });
        const throatMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x0000FF });
        const headFrameOuterRadius = 1.0;
        const headFrameThickness = 0.1;
        const headFrameDepth = 0.05;
        const effectiveInnerRadiusX = headFrameOuterRadius - headFrameThickness;
        const effectiveInnerRadiusY = headFrameOuterRadius - headFrameThickness;
        const numSegments = 16;
        for (let i = 0; i <= numSegments; i++) {
            const angle = (i / numSegments) * Math.PI;
            const x = headFrameOuterRadius * Math.cos(angle);
            const y = headFrameOuterRadius * Math.sin(angle);
            if (i < numSegments) {
                const nextAngle = ((i + 1) / numSegments) * Math.PI;
                const nextX = headFrameOuterRadius * Math.cos(nextAngle);
                const nextY = headFrameOuterRadius * Math.sin(nextAngle);
                const segmentMidX = (x + nextX) / 2;
                const segmentMidY = (y + nextY) / 2;
                const segmentLength = Math.sqrt(Math.pow(x - nextX, 2) + Math.pow(y - nextY, 2));
                const segmentGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(headFrameThickness, segmentLength, headFrameDepth);
                const segmentMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(segmentGeometry, frameMaterial);
                segmentMesh.position.set(segmentMidX, segmentMidY, 0);
                segmentMesh.rotation.z = Math.atan2(nextY - y, nextX - x) - Math.PI / 2;
                this.tennisRacketModel.add(segmentMesh);
            }
        }
        for (let i = 0; i <= numSegments; i++) {
            const angle = (i / numSegments) * Math.PI;
            const x = headFrameOuterRadius * Math.cos(angle);
            const y = -headFrameOuterRadius * Math.sin(angle);
            if (i < numSegments) {
                const nextAngle = ((i + 1) / numSegments) * Math.PI;
                const nextX = headFrameOuterRadius * Math.cos(nextAngle);
                const nextY = -headFrameOuterRadius * Math.sin(nextAngle);
                const segmentMidX = (x + nextX) / 2;
                const segmentMidY = (y + nextY) / 2;
                const segmentLength = Math.sqrt(Math.pow(x - nextX, 2) + Math.pow(y - nextY, 2));
                const segmentGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(headFrameThickness, segmentLength, headFrameDepth);
                const segmentMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(segmentGeometry, frameMaterial);
                segmentMesh.position.set(segmentMidX, segmentMidY, 0);
                segmentMesh.rotation.z = Math.atan2(nextY - y, nextX - x) - Math.PI / 2;
                this.tennisRacketModel.add(segmentMesh);
            }
        }
        // ガット描画 
        const stringGapX = 0.15;
        const stringGapY = 0.15;
        const stringThickness = 0.02;
        const stringDepth = headFrameDepth * 1.5;
        // ガットを描画する実際の範囲
        const stringPlayAreaX = effectiveInnerRadiusX * 2 - stringThickness; // X方向のガットの描画可能幅
        const stringPlayAreaY = effectiveInnerRadiusY * 2 - stringThickness; // Y方向のガットの描画可能高さ
        // 垂直方向ガット
        const numVerticalStrings = Math.floor(stringPlayAreaX / stringGapX);
        for (let i = -numVerticalStrings / 2; i <= numVerticalStrings / 2; i++) {
            const xPos = i * stringGapX;
            // X位置に応じたYの最大値（フレーム内側）を計算
            const maxY = Math.sqrt(Math.pow(effectiveInnerRadiusY, 2) - Math.pow(xPos, 2));
            if (isNaN(maxY))
                continue; // 計算不能な場合はスキップ
            const stringLength = (maxY * 2) - stringThickness; // ガットの太さを考慮して長さを調整
            if (stringLength > 0) { // 長さが正の場合のみ描画
                const stringGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(stringThickness, stringLength, stringDepth);
                const stringMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(stringGeometry, stringMaterial);
                stringMesh.position.set(xPos, 0, 0);
                this.tennisRacketModel.add(stringMesh);
            }
        }
        // 水平方向ガット
        const numHorizontalStrings = Math.floor(stringPlayAreaY / stringGapY);
        for (let i = -numHorizontalStrings / 2; i <= numHorizontalStrings / 2; i++) {
            const yPos = i * stringGapY;
            // Y位置に応じたXの最大値（フレーム内側）を計算
            const maxX = Math.sqrt(Math.pow(effectiveInnerRadiusX, 2) - Math.pow(yPos, 2));
            if (isNaN(maxX))
                continue; // 計算不能な場合はスキップ
            const stringLength = (maxX * 2) - stringThickness; // ガットの太さを考慮して長さを調整
            if (stringLength > 0) { // 長さが正の場合のみ描画
                const stringGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(stringLength, stringThickness, stringDepth);
                const stringMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(stringGeometry, stringMaterial);
                stringMesh.position.set(0, yPos, 0);
                this.tennisRacketModel.add(stringMesh);
            }
        }
        const throatGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.1, 0.1, 0.8, 16);
        const racketThroat = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(throatGeometry, throatMaterial);
        racketThroat.position.y = -headFrameOuterRadius - 0.4;
        this.tennisRacketModel.add(racketThroat);
        const gripGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.15, 0.15, 1.5, 16);
        const racketGrip = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(gripGeometry, gripMaterial);
        racketGrip.position.y = racketThroat.position.y - (0.8 / 2) - (1.5 / 2);
        this.tennisRacketModel.add(racketGrip);
        this.tennisRacketModel.scale.set(1.5, 1.5, 1.5);
        this.tennisRacketModel.quaternion.copy(this.currentRacketQuaternion);
        this.tennisRacketModel.traverse((child) => {
            if (child instanceof three__WEBPACK_IMPORTED_MODULE_1__.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this.scene.add(this.tennisRacketModel);
        console.log("Tennis racket created procedurally and added to scene.");
        const initialRacketX = 0;
        const initialRacketY = 1;
        const initialRacketZ = 12;
        this.tennisRacketModel.position.set(initialRacketX, initialRacketY, initialRacketZ);
        const racketHeadWidthPhysics = headFrameOuterRadius * 2 * this.tennisRacketModel.scale.x;
        const racketHeadHeightPhysics = headFrameOuterRadius * 2 * this.tennisRacketModel.scale.y;
        const racketHeadDepthPhysics = headFrameDepth * this.tennisRacketModel.scale.z;
        const racketHeadShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(racketHeadWidthPhysics / 2, racketHeadHeightPhysics / 2, racketHeadDepthPhysics / 2));
        this.cannonRacketBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            type: cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body.KINEMATIC,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(initialRacketX, initialRacketY, initialRacketZ),
            shape: racketHeadShape,
            material: this.racketMaterialPhysics
        });
        this.cannonRacketBody.quaternion.copy(this.tennisRacketModel.quaternion);
        this.cannonWorld.addBody(this.cannonRacketBody);
        const tennisBallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(this.tennisBallRadius, 32, 32);
        const tennisBallMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({
            color: 0xccff00,
            roughness: 0.8,
            metalness: 0.1
        });
        this.tennisBall = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(tennisBallGeometry, tennisBallMaterial);
        this.tennisBall.position.set(0, 0.5, 5);
        this.tennisBall.castShadow = true;
        this.scene.add(this.tennisBall);
        const ballShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(this.tennisBallRadius);
        this.cannonBallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 1,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(this.tennisBall.position.x, this.tennisBall.position.y, this.tennisBall.position.z),
            shape: ballShape,
            material: this.ballMaterial,
            type: cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body.STATIC
        });
        this.cannonWorld.addBody(this.cannonBallBody);
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.8);
        this.light.position.set(5, 5, 5).normalize();
        this.light.castShadow = true;
        this.scene.add(this.light);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 10, 20));
    document.body.appendChild(viewport);
    viewport.tabIndex = 1;
    viewport.focus();
    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            console.log("Space key pressed! Launching ball with Cannon.js!");
            container.cannonBallBody.position.set(0, 0.5, 5);
            container.cannonBallBody.velocity.set(0, 0, 0);
            container.cannonBallBody.angularVelocity.set(0, 0, 0);
            container.cannonBallBody.type = cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body.DYNAMIC;
            container.cannonBallBody.velocity.set(0, 7, -18);
        }
        else if (event.code === 'KeyR') {
            console.log("R key pressed! Resetting ball and hit count.");
            container.cannonBallBody.position.set(0, 0.5, 5);
            container.cannonBallBody.velocity.set(0, 0, 0);
            container.cannonBallBody.angularVelocity.set(0, 0, 0);
            container.cannonBallBody.type = cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body.STATIC;
            container.resetHitCount();
        }
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YSxFQUFFLENBQUM7U0FDN0I7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7Ozs7Ozs7VUNwakJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHNjZW5lO1xuICAgIGxpZ2h0O1xuICAgIHRlbm5pc0JhbGw7XG4gICAgdGVubmlzV2FsbDtcbiAgICBjb3VydFBsYW5lO1xuXG4gICAgY2Fubm9uV29ybGQ7XG4gICAgY2Fubm9uQmFsbEJvZHk7XG4gICAgY2Fubm9uV2FsbEJvZHk7XG4gICAgY2Fubm9uR3JvdW5kQm9keTtcbiAgICBjYW5ub25SYWNrZXRCb2R5ID0gbnVsbDtcblxuICAgIGdyb3VuZE1hdGVyaWFsO1xuICAgIGJhbGxNYXRlcmlhbDsgXG4gICAgd2FsbE1hdGVyaWFsO1xuICAgIGNvdXJ0Qm91bmRhcnlNYXRlcmlhbDtcbiAgICByYWNrZXRNYXRlcmlhbFBoeXNpY3M7XG5cbiAgICBib29zdGVkQmFsbE1hdGVyaWFsOyBcbiAgICBkZWZhdWx0QmFsbFJlc3RpdHV0aW9uID0gMC43OyBcbiAgICB3YWxsQmFsbFJlc3RpdHV0aW9uID0gMS4wOyBcblxuICAgIGJhbGxEaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTsgXG4gICAgYmFsbFNwZWVkID0gMC41O1xuXG4gICAgd2FsbFdpZHRoID0gMjA7XG4gICAgd2FsbEhlaWdodCA9IDE1O1xuICAgIHdhbGxEZXB0aCA9IDAuMjtcblxuICAgIGNvdXJ0TGVuZ3RoID0gMTU7IFxuICAgIGNvdXJ0UGxhbmVIZWlnaHQ7IFxuXG4gICAgY291cnRXaWR0aFNpbmdsZXM7XG4gICAgY291cnRXaWR0aERvdWJsZXM7XG5cbiAgICBzZXJ2aWNlTGluZURpc3RhbmNlID0gNi40MDtcbiAgICBjZW50ZXJNYXJrTGVuZ3RoID0gMC4xMDtcblxuICAgIGNvdXJ0TGluZVRoaWNrbmVzcyA9IDAuMDU7XG4gICAgZnJvbnRCYXNlbGluZVo7XG4gICAgY291cnRHcm91bmRZID0gLTIuMTtcbiAgICB0ZW5uaXNCYWxsUmFkaXVzID0gMC41O1xuICAgIGJhY2tCYXNlbGluZVo7XG5cbiAgICByZW5kZXJlcjtcbiAgICBjYW1lcmE7XG4gICAgb3JiaXRDb250cm9scztcblxuICAgIHRlbm5pc1JhY2tldE1vZGVsID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgbW91c2VYID0gMDtcbiAgICByYWNrZXRNb3ZlUmFuZ2VYO1xuXG4gICAgaW5pdGlhbFJhY2tldFJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKDAsIE1hdGguUEksIE1hdGguUEkgLyAyLCAnWFlaJyk7XG4gICAgdGFyZ2V0UmFja2V0Um90YXRpb25ZT2Zmc2V0ID0gMDtcbiAgICBjdXJyZW50UmFja2V0UXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyKG5ldyBUSFJFRS5FdWxlcigwLCBNYXRoLlBJLCBNYXRoLlBJIC8gMikpO1xuXG4gICAgaGl0Q291bnQgPSAwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY291cnRQbGFuZUhlaWdodCA9IHRoaXMuY291cnRMZW5ndGggKyA2O1xuICAgICAgICB0aGlzLmNvdXJ0V2lkdGhTaW5nbGVzID0gdGhpcy53YWxsV2lkdGg7XG4gICAgICAgIHRoaXMuY291cnRXaWR0aERvdWJsZXMgPSB0aGlzLndhbGxXaWR0aDtcbiAgICAgICAgdGhpcy5yYWNrZXRNb3ZlUmFuZ2VYID0gdGhpcy53YWxsV2lkdGggLyAyIC0gMTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aCwgaGVpZ2h0LCBjYW1lcmFQb3MpID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgdGhpcy5jYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyh0aGlzLmNhbWVyYSwgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMuZGFtcGluZ0ZhY3RvciA9IDAuMjU7XG4gICAgICAgIHRoaXMub3JiaXRDb250cm9scy5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmluaXRQaHlzaWNzKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTsgXG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKCh0aW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbm5vbldvcmxkLnN0ZXAoMSAvIDYwKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY2Fubm9uQmFsbEJvZHkgJiYgdGhpcy50ZW5uaXNCYWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZW5uaXNCYWxsLnBvc2l0aW9uLmNvcHkodGhpcy5jYW5ub25CYWxsQm9keS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy50ZW5uaXNCYWxsLnF1YXRlcm5pb24uY29weSh0aGlzLmNhbm5vbkJhbGxCb2R5LnF1YXRlcm5pb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy50ZW5uaXNSYWNrZXRNb2RlbCAmJiB0aGlzLmNhbm5vblJhY2tldEJvZHkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRYID0gdGhpcy5tb3VzZVggKiB0aGlzLnJhY2tldE1vdmVSYW5nZVg7XG4gICAgICAgICAgICAgICAgdGhpcy50ZW5uaXNSYWNrZXRNb2RlbC5wb3NpdGlvbi54ICs9ICh0YXJnZXRYIC0gdGhpcy50ZW5uaXNSYWNrZXRNb2RlbC5wb3NpdGlvbi54KSAqIDAuMzsgXG5cbiAgICAgICAgICAgICAgICBjb25zdCByYWNrZXRDdXJyZW50WCA9IHRoaXMudGVubmlzUmFja2V0TW9kZWwucG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICBjb25zdCByb3RhdGlvbkZhY3RvciA9IDAuMTtcblxuICAgICAgICAgICAgICAgIGlmIChyYWNrZXRDdXJyZW50WCA8IC0wLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRSYWNrZXRSb3RhdGlvbllPZmZzZXQgPSAtIChyYWNrZXRDdXJyZW50WCArIDAuNSkgKiByb3RhdGlvbkZhY3RvcjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJhY2tldEN1cnJlbnRYID4gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0UmFja2V0Um90YXRpb25ZT2Zmc2V0ID0gLSAocmFja2V0Q3VycmVudFggLSAwLjUpICogcm90YXRpb25GYWN0b3I7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRSYWNrZXRSb3RhdGlvbllPZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRRdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5FdWxlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFJhY2tldFJvdGF0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxSYWNrZXRSb3RhdGlvbi55ICsgdGhpcy50YXJnZXRSYWNrZXRSb3RhdGlvbllPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxSYWNrZXRSb3RhdGlvbi56LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsUmFja2V0Um90YXRpb24ub3JkZXJcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UmFja2V0UXVhdGVybmlvbi5zbGVycCh0YXJnZXRRdWF0ZXJuaW9uLCAwLjEpO1xuICAgICAgICAgICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwucXVhdGVybmlvbi5jb3B5KHRoaXMuY3VycmVudFJhY2tldFF1YXRlcm5pb24pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5ub25SYWNrZXRCb2R5LnBvc2l0aW9uLmNvcHkodGhpcy50ZW5uaXNSYWNrZXRNb2RlbC5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5ub25SYWNrZXRCb2R5LnF1YXRlcm5pb24uY29weSh0aGlzLmN1cnJlbnRSYWNrZXRRdWF0ZXJuaW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiOyBcbiAgICAgICAgXG4gICAgICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC50YWJJbmRleCA9IDE7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tb3VzZVggPSAoZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICBpbml0UGh5c2ljcyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYW5ub25Xb3JsZCA9IG5ldyBDQU5OT04uV29ybGQoKTtcbiAgICAgICAgdGhpcy5jYW5ub25Xb3JsZC5ncmF2aXR5LnNldCgwLCAtOS44MiwgMCk7XG5cbiAgICAgICAgdGhpcy5ncm91bmRNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoXCJncm91bmRNYXRlcmlhbFwiKTtcbiAgICAgICAgdGhpcy5iYWxsTWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwiYmFsbE1hdGVyaWFsXCIpOyBcbiAgICAgICAgdGhpcy53YWxsTWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwid2FsbE1hdGVyaWFsXCIpO1xuICAgICAgICB0aGlzLmNvdXJ0Qm91bmRhcnlNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoXCJjb3VydEJvdW5kYXJ5TWF0ZXJpYWxcIik7XG4gICAgICAgIHRoaXMucmFja2V0TWF0ZXJpYWxQaHlzaWNzID0gbmV3IENBTk5PTi5NYXRlcmlhbChcInJhY2tldE1hdGVyaWFsUGh5c2ljc1wiKTtcblxuICAgICAgICB0aGlzLmJvb3N0ZWRCYWxsTWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwiYm9vc3RlZEJhbGxNYXRlcmlhbFwiKTsgXG5cbiAgICAgICAgY29uc3QgZ3JvdW5kQmFsbENvbnRhY3RNYXRlcmlhbCA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKFxuICAgICAgICAgICAgdGhpcy5ncm91bmRNYXRlcmlhbCxcbiAgICAgICAgICAgIHRoaXMuYmFsbE1hdGVyaWFsLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZyaWN0aW9uOiAwLjgsXG4gICAgICAgICAgICAgICAgcmVzdGl0dXRpb246IHRoaXMuZGVmYXVsdEJhbGxSZXN0aXR1dGlvblxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNhbm5vbldvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChncm91bmRCYWxsQ29udGFjdE1hdGVyaWFsKTtcblxuICAgICAgICBjb25zdCB3YWxsQmFsbENvbnRhY3RNYXRlcmlhbCA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKFxuICAgICAgICAgICAgdGhpcy53YWxsTWF0ZXJpYWwsXG4gICAgICAgICAgICB0aGlzLmJhbGxNYXRlcmlhbCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmcmljdGlvbjogMC42LFxuICAgICAgICAgICAgICAgIHJlc3RpdHV0aW9uOiB0aGlzLndhbGxCYWxsUmVzdGl0dXRpb24gXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2Fubm9uV29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKHdhbGxCYWxsQ29udGFjdE1hdGVyaWFsKTtcblxuICAgICAgICBjb25zdCBib3VuZGFyeUJhbGxDb250YWN0TWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChcbiAgICAgICAgICAgIHRoaXMuY291cnRCb3VuZGFyeU1hdGVyaWFsLFxuICAgICAgICAgICAgdGhpcy5iYWxsTWF0ZXJpYWwsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnJpY3Rpb246IDAuMixcbiAgICAgICAgICAgICAgICByZXN0aXR1dGlvbjogMi4wXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2Fubm9uV29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGJvdW5kYXJ5QmFsbENvbnRhY3RNYXRlcmlhbCk7XG5cbiAgICAgICAgY29uc3QgcmFja2V0QmFsbENvbnRhY3RNYXRlcmlhbCA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKFxuICAgICAgICAgICAgdGhpcy5yYWNrZXRNYXRlcmlhbFBoeXNpY3MsXG4gICAgICAgICAgICB0aGlzLmJhbGxNYXRlcmlhbCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmcmljdGlvbjogMC4xLFxuICAgICAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAxLjkgXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2Fubm9uV29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKHJhY2tldEJhbGxDb250YWN0TWF0ZXJpYWwpO1xuXG4gICAgICAgIHRoaXMuY2Fubm9uV29ybGQuYWRkRXZlbnRMaXN0ZW5lcignY29sbGlkZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYm9keUEgPSBldmVudC5ib2R5QTtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlCID0gZXZlbnQuYm9keUI7XG5cbiAgICAgICAgICAgIGlmICgoYm9keUEgPT09IHRoaXMuY2Fubm9uQmFsbEJvZHkgJiYgYm9keUIgPT09IHRoaXMuY2Fubm9uV2FsbEJvZHkpIHx8XG4gICAgICAgICAgICAgICAgKGJvZHlCID09PSB0aGlzLmNhbm5vbkJhbGxCb2R5ICYmIGJvZHlBID09PSB0aGlzLmNhbm5vbldhbGxCb2R5KSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFsbCBoaXQgdGhlIHdhbGwhXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGl0Q291bnQrKzsgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFdhbGwgSGl0czogJHt0aGlzLmhpdENvdW50fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKGJvZHlBID09PSB0aGlzLmNhbm5vbkJhbGxCb2R5ICYmIGJvZHlCID09PSB0aGlzLmNhbm5vbkdyb3VuZEJvZHkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAoYm9keUIgPT09IHRoaXMuY2Fubm9uQmFsbEJvZHkgJiYgYm9keUEgPT09IHRoaXMuY2Fubm9uR3JvdW5kQm9keSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhbGwgaGl0IHRoZSBncm91bmQhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKGJvZHlBID09PSB0aGlzLmNhbm5vbkJhbGxCb2R5ICYmIGJvZHlCID09PSB0aGlzLmNhbm5vblJhY2tldEJvZHkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAoYm9keUIgPT09IHRoaXMuY2Fubm9uQmFsbEJvZHkgJiYgYm9keUEgPT09IHRoaXMuY2Fubm9uUmFja2V0Qm9keSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhbGwgaGl0IHRoZSByYWNrZXQhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBcbiAgICB1cGRhdGVIaXRDb3VudERpc3BsYXkgPSAoKSA9PiB7XG4gICAgICAgXG4gICAgfVxuXG4gICAgcmVzZXRIaXRDb3VudCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5oaXRDb3VudCA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKGBXYWxsIEhpdHM6ICR7dGhpcy5oaXRDb3VudH0gKFJlc2V0KWApOyAvLyDjg6rjgrvjg4Pjg4jmmYLjgoLjgrPjg7Pjgr3jg7zjg6vjgavooajnpLpcbiAgICB9XG5cblxuICAgIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgY29uc3Qgd2FsbEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHRoaXMud2FsbFdpZHRoLCB0aGlzLndhbGxIZWlnaHQsIHRoaXMud2FsbERlcHRoKTtcbiAgICAgICAgY29uc3Qgd2FsbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgXG4gICAgICAgICAgICBjb2xvcjogMHgzMzY2OTksXG4gICAgICAgICAgICByb3VnaG5lc3M6IDAuNyxcbiAgICAgICAgICAgIG1ldGFsbmVzczogMC4xXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRlbm5pc1dhbGwgPSBuZXcgVEhSRUUuTWVzaCh3YWxsR2VvbWV0cnksIHdhbGxNYXRlcmlhbCk7IFxuICAgICAgICB0aGlzLnRlbm5pc1dhbGwucG9zaXRpb24uc2V0KDAsIHRoaXMud2FsbEhlaWdodCAvIDIgLSAyLCAtMTApOyBcbiAgICAgICAgdGhpcy50ZW5uaXNXYWxsLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnRlbm5pc1dhbGwucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMudGVubmlzV2FsbCk7XG5cbiAgICAgICAgY29uc3Qgd2FsbFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHRoaXMud2FsbFdpZHRoIC8gMiwgdGhpcy53YWxsSGVpZ2h0IC8gMiwgdGhpcy53YWxsRGVwdGggLyAyKSk7XG4gICAgICAgIHRoaXMuY2Fubm9uV2FsbEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzModGhpcy50ZW5uaXNXYWxsLnBvc2l0aW9uLngsIHRoaXMudGVubmlzV2FsbC5wb3NpdGlvbi55LCB0aGlzLnRlbm5pc1dhbGwucG9zaXRpb24ueiksXG4gICAgICAgICAgICBzaGFwZTogd2FsbFNoYXBlLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMud2FsbE1hdGVyaWFsLFxuICAgICAgICAgICAgdHlwZTogQ0FOTk9OLkJvZHkuU1RBVElDXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbm5vbldvcmxkLmFkZEJvZHkodGhpcy5jYW5ub25XYWxsQm9keSk7XG5cbiAgICAgICAgdGhpcy5iYWNrQmFzZWxpbmVaID0gdGhpcy50ZW5uaXNXYWxsLnBvc2l0aW9uLnogKyB0aGlzLndhbGxEZXB0aCAvIDIgKyB0aGlzLmNvdXJ0TGluZVRoaWNrbmVzcyAvIDIgKyAwLjE7XG5cblxuICAgICAgICBjb25zdCBjb3VydFBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSh0aGlzLndhbGxXaWR0aCwgdGhpcy5jb3VydFBsYW5lSGVpZ2h0KTtcbiAgICAgICAgY29uc3QgY291cnRQbGFuZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4M2NiMzcxIH0pO1xuICAgICAgICB0aGlzLmNvdXJ0UGxhbmUgPSBuZXcgVEhSRUUuTWVzaChjb3VydFBsYW5lR2VvbWV0cnksIGNvdXJ0UGxhbmVNYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuY291cnRQbGFuZS5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICB0aGlzLmNvdXJ0UGxhbmUucG9zaXRpb24ueSA9IHRoaXMuY291cnRHcm91bmRZO1xuICAgICAgICB0aGlzLmNvdXJ0UGxhbmUucG9zaXRpb24ueiA9IHRoaXMudGVubmlzV2FsbC5wb3NpdGlvbi56ICsgdGhpcy53YWxsRGVwdGggLyAyICsgdGhpcy5jb3VydExlbmd0aCAvIDI7IFxuICAgICAgICB0aGlzLmNvdXJ0UGxhbmUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY291cnRQbGFuZSk7XG5cbiAgICAgICAgY29uc3QgZ3JvdW5kU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzModGhpcy53YWxsV2lkdGggLyAyLCB0aGlzLmNvdXJ0TGluZVRoaWNrbmVzcyAvIDIsIHRoaXMuY291cnRQbGFuZUhlaWdodCAvIDIpKTtcbiAgICAgICAgdGhpcy5jYW5ub25Hcm91bmRCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgIG1hc3M6IDAsXG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKHRoaXMuY291cnRQbGFuZS5wb3NpdGlvbi54LCB0aGlzLmNvdXJ0UGxhbmUucG9zaXRpb24ueSwgdGhpcy5jb3VydFBsYW5lLnBvc2l0aW9uLnopLFxuICAgICAgICAgICAgc2hhcGU6IGdyb3VuZFNoYXBlLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuZ3JvdW5kTWF0ZXJpYWwsXG4gICAgICAgICAgICB0eXBlOiBDQU5OT04uQm9keS5TVEFUSUNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2Fubm9uV29ybGQuYWRkQm9keSh0aGlzLmNhbm5vbkdyb3VuZEJvZHkpO1xuXG5cbiAgICAgICAgY29uc3QgY291cnRMaW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZmZmZmYgfSk7XG4gICAgICAgIGNvbnN0IGxpbmVZUG9zaXRpb24gPSB0aGlzLmNvdXJ0R3JvdW5kWSArIHRoaXMuY291cnRMaW5lVGhpY2tuZXNzIC8gMjtcblxuICAgICAgICBjb25zdCBiYWNrQmFzZWxpbmVMZW5ndGggPSB0aGlzLmNvdXJ0V2lkdGhTaW5nbGVzOyBcbiAgICAgICAgY29uc3QgYmFja0Jhc2VsaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoYmFja0Jhc2VsaW5lTGVuZ3RoLCB0aGlzLmNvdXJ0TGluZVRoaWNrbmVzcywgdGhpcy5jb3VydExpbmVUaGlja25lc3MpO1xuICAgICAgICBjb25zdCBiYWNrQmFzZWxpbmUgPSBuZXcgVEhSRUUuTWVzaChiYWNrQmFzZWxpbmVHZW9tZXRyeSwgY291cnRMaW5lTWF0ZXJpYWwpO1xuICAgICAgICBiYWNrQmFzZWxpbmUucG9zaXRpb24uc2V0KDAsIGxpbmVZUG9zaXRpb24sIHRoaXMuYmFja0Jhc2VsaW5lWik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGJhY2tCYXNlbGluZSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZUxpbmVMZW5ndGggPSB0aGlzLmNvdXJ0V2lkdGhTaW5nbGVzOyBcbiAgICAgICAgY29uc3Qgc2VydmljZUxpbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShzZXJ2aWNlTGluZUxlbmd0aCwgdGhpcy5jb3VydExpbmVUaGlja25lc3MsIHRoaXMuY291cnRMaW5lVGhpY2tuZXNzKTtcbiAgICAgICAgY29uc3Qgc2VydmljZUxpbmVGcm9udCA9IG5ldyBUSFJFRS5NZXNoKHNlcnZpY2VMaW5lR2VvbWV0cnksIGNvdXJ0TGluZU1hdGVyaWFsKTtcbiAgICAgICAgY29uc3Qgc2VydmljZUxpbmVaID0gdGhpcy5iYWNrQmFzZWxpbmVaICsgdGhpcy5zZXJ2aWNlTGluZURpc3RhbmNlOyBcbiAgICAgICAgc2VydmljZUxpbmVGcm9udC5wb3NpdGlvbi5zZXQoMCwgbGluZVlQb3NpdGlvbiwgc2VydmljZUxpbmVaKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoc2VydmljZUxpbmVGcm9udCk7XG5cbiAgICAgICAgY29uc3QgY2VudGVyU2VydmljZUxpbmVMZW5ndGggPSB0aGlzLnNlcnZpY2VMaW5lRGlzdGFuY2U7XG4gICAgICAgIGNvbnN0IGNlbnRlclNlcnZpY2VMaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkodGhpcy5jb3VydExpbmVUaGlja25lc3MsIHRoaXMuY291cnRMaW5lVGhpY2tuZXNzLCBjZW50ZXJTZXJ2aWNlTGluZUxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgY2VudGVyU2VydmljZUxpbmUgPSBuZXcgVEhSRUUuTWVzaChjZW50ZXJTZXJ2aWNlTGluZUdlb21ldHJ5LCBjb3VydExpbmVNYXRlcmlhbCk7XG4gICAgICAgIGNvbnN0IGNlbnRlclNlcnZpY2VMaW5lWiA9IChzZXJ2aWNlTGluZVogKyBiYWNrQmFzZWxpbmUucG9zaXRpb24ueikgLyAyO1xuICAgICAgICBjZW50ZXJTZXJ2aWNlTGluZS5wb3NpdGlvbi5zZXQoMCwgbGluZVlQb3NpdGlvbiwgY2VudGVyU2VydmljZUxpbmVaKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2VudGVyU2VydmljZUxpbmUpO1xuXG4gICAgICAgIGNvbnN0IHNpZGVMaW5lTGVuZ3RoID0gdGhpcy5jb3VydExlbmd0aDsgXG4gICAgICAgIGNvbnN0IHNpZGVMaW5lT2Zmc2V0ID0gdGhpcy5jb3VydFdpZHRoU2luZ2xlcyAvIDI7XG4gICAgICAgIGNvbnN0IHNpZGVMaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkodGhpcy5jb3VydExpbmVUaGlja25lc3MsIHRoaXMuY291cnRMaW5lVGhpY2tuZXNzLCBzaWRlTGluZUxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgbGVmdFNpZGVMaW5lID0gbmV3IFRIUkVFLk1lc2goc2lkZUxpbmVHZW9tZXRyeSwgY291cnRMaW5lTWF0ZXJpYWwpO1xuICAgICAgICBsZWZ0U2lkZUxpbmUucG9zaXRpb24uc2V0KC1zaWRlTGluZU9mZnNldCwgbGluZVlQb3NpdGlvbiwgdGhpcy5iYWNrQmFzZWxpbmVaICsgdGhpcy5jb3VydExlbmd0aCAvIDIpOyBcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGVmdFNpZGVMaW5lKTtcblxuICAgICAgICBjb25zdCByaWdodFNpZGVMaW5lID0gbmV3IFRIUkVFLk1lc2goc2lkZUxpbmVHZW9tZXRyeSwgY291cnRMaW5lTWF0ZXJpYWwpO1xuICAgICAgICByaWdodFNpZGVMaW5lLnBvc2l0aW9uLnNldChzaWRlTGluZU9mZnNldCwgbGluZVlQb3NpdGlvbiwgdGhpcy5iYWNrQmFzZWxpbmVaICsgdGhpcy5jb3VydExlbmd0aCAvIDIpOyBcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocmlnaHRTaWRlTGluZSk7XG5cbiAgICAgICAgdGhpcy5mcm9udEJhc2VsaW5lWiA9IHRoaXMuYmFja0Jhc2VsaW5lWiArIHRoaXMuY291cnRMZW5ndGggLSB0aGlzLmNvdXJ0TGluZVRoaWNrbmVzcyAvIDI7XG5cblxuICAgICAgICBjb25zdCBuZXRMaW5lQ29sb3IgPSAweGZmZmZmZjtcbiAgICAgICAgY29uc3QgbmV0TGluZVRoaWNrbmVzcyA9IDAuMDU7XG4gICAgICAgIGNvbnN0IG5ldExpbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiBuZXRMaW5lQ29sb3IgfSk7XG5cbiAgICAgICAgY29uc3QgbmV0SGVpZ2h0ID0gdGhpcy53YWxsSGVpZ2h0IC8gMztcbiAgICAgICAgY29uc3QgaG9yaXpvbnRhbE5ldExpbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSh0aGlzLndhbGxXaWR0aCwgbmV0TGluZVRoaWNrbmVzcywgbmV0TGluZVRoaWNrbmVzcyk7XG4gICAgICAgIGNvbnN0IGhvcml6b250YWxOZXRMaW5lID0gbmV3IFRIUkVFLk1lc2goaG9yaXpvbnRhbE5ldExpbmVHZW9tZXRyeSwgbmV0TGluZU1hdGVyaWFsKTtcbiAgICAgICAgaG9yaXpvbnRhbE5ldExpbmUucG9zaXRpb24uc2V0KDAsIG5ldEhlaWdodCAtIDIsIHRoaXMudGVubmlzV2FsbC5wb3NpdGlvbi56ICsgdGhpcy53YWxsRGVwdGggLyAyICsgbmV0TGluZVRoaWNrbmVzcyAvIDIpO1xuICAgICAgICBob3Jpem9udGFsTmV0TGluZS5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgaG9yaXpvbnRhbE5ldExpbmUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGhvcml6b250YWxOZXRMaW5lKTtcblxuICAgICAgICBjb25zdCBudW1WZXJ0aWNhbE5ldExpbmVzID0gNTtcbiAgICAgICAgY29uc3QgdmVydGljYWxOZXRMaW5lTGVuZ3RoID0gdGhpcy53YWxsSGVpZ2h0IC0gbmV0SGVpZ2h0O1xuICAgICAgICBjb25zdCB2ZXJ0aWNhbE5ldExpbmVUb3BPZmZzZXQgPSB0aGlzLndhbGxIZWlnaHQgLyAyIC0gMjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVZlcnRpY2FsTmV0TGluZXM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KG5ldExpbmVUaGlja25lc3MsIHZlcnRpY2FsTmV0TGluZUxlbmd0aCwgbmV0TGluZVRoaWNrbmVzcyk7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IFRIUkVFLk1lc2gobGluZUdlb21ldHJ5LCBuZXRMaW5lTWF0ZXJpYWwpO1xuXG4gICAgICAgICAgICBjb25zdCB4UG9zID0gKGkgLyAobnVtVmVydGljYWxOZXRMaW5lcyAtIDEpKSAqIHRoaXMud2FsbFdpZHRoIC0gKHRoaXMud2FsbFdpZHRoIC8gMik7XG4gICAgICAgICAgICBsaW5lLnBvc2l0aW9uLnNldCh4UG9zLCBuZXRIZWlnaHQgLyAyICsgdmVydGljYWxOZXRMaW5lVG9wT2Zmc2V0LCB0aGlzLnRlbm5pc1dhbGwucG9zaXRpb24ueiArIHRoaXMud2FsbERlcHRoIC8gMiArIG5ldExpbmVUaGlja25lc3MgLyAyKTtcbiAgICAgICAgICAgIGxpbmUuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgICAgICBsaW5lLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobGluZSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IGZyYW1lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHg4QTJCRTIgfSk7XG4gICAgICAgIGNvbnN0IHN0cmluZ01hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MDBGRjAwIH0pO1xuICAgICAgICBjb25zdCBncmlwTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhGRkZGRkYgfSk7XG4gICAgICAgIGNvbnN0IHRocm9hdE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MDAwMEZGIH0pO1xuXG4gICAgICAgIGNvbnN0IGhlYWRGcmFtZU91dGVyUmFkaXVzID0gMS4wO1xuICAgICAgICBjb25zdCBoZWFkRnJhbWVUaGlja25lc3MgPSAwLjE7XG4gICAgICAgIGNvbnN0IGhlYWRGcmFtZURlcHRoID0gMC4wNTtcblxuICAgICAgICBcbiAgICAgICAgY29uc3QgZWZmZWN0aXZlSW5uZXJSYWRpdXNYID0gaGVhZEZyYW1lT3V0ZXJSYWRpdXMgLSBoZWFkRnJhbWVUaGlja25lc3M7XG4gICAgICAgIGNvbnN0IGVmZmVjdGl2ZUlubmVyUmFkaXVzWSA9IGhlYWRGcmFtZU91dGVyUmFkaXVzIC0gaGVhZEZyYW1lVGhpY2tuZXNzO1xuXG4gICAgICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMTY7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IG51bVNlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGkgLyBudW1TZWdtZW50cykgKiBNYXRoLlBJO1xuICAgICAgICAgICAgY29uc3QgeCA9IGhlYWRGcmFtZU91dGVyUmFkaXVzICogTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgY29uc3QgeSA9IGhlYWRGcmFtZU91dGVyUmFkaXVzICogTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgICAgICAgICBpZiAoaSA8IG51bVNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEFuZ2xlID0gKChpICsgMSkgLyBudW1TZWdtZW50cykgKiBNYXRoLlBJO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRYID0gaGVhZEZyYW1lT3V0ZXJSYWRpdXMgKiBNYXRoLmNvcyhuZXh0QW5nbGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRZID0gaGVhZEZyYW1lT3V0ZXJSYWRpdXMgKiBNYXRoLnNpbihuZXh0QW5nbGUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudE1pZFggPSAoeCArIG5leHRYKSAvIDI7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudE1pZFkgPSAoeSArIG5leHRZKSAvIDI7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudExlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh4IC0gbmV4dFgsIDIpICsgTWF0aC5wb3coeSAtIG5leHRZLCAyKSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoaGVhZEZyYW1lVGhpY2tuZXNzLCBzZWdtZW50TGVuZ3RoLCBoZWFkRnJhbWVEZXB0aCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudE1lc2ggPSBuZXcgVEhSRUUuTWVzaChzZWdtZW50R2VvbWV0cnksIGZyYW1lTWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIHNlZ21lbnRNZXNoLnBvc2l0aW9uLnNldChzZWdtZW50TWlkWCwgc2VnbWVudE1pZFksIDApO1xuICAgICAgICAgICAgICAgIHNlZ21lbnRNZXNoLnJvdGF0aW9uLnogPSBNYXRoLmF0YW4yKG5leHRZIC0geSwgbmV4dFggLSB4KSAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwuYWRkKHNlZ21lbnRNZXNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IG51bVNlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGkgLyBudW1TZWdtZW50cykgKiBNYXRoLlBJO1xuICAgICAgICAgICAgY29uc3QgeCA9IGhlYWRGcmFtZU91dGVyUmFkaXVzICogTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgY29uc3QgeSA9IC1oZWFkRnJhbWVPdXRlclJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICAgICAgaWYgKGkgPCBudW1TZWdtZW50cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRBbmdsZSA9ICgoaSArIDEpIC8gbnVtU2VnbWVudHMpICogTWF0aC5QSTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0WCA9IGhlYWRGcmFtZU91dGVyUmFkaXVzICogTWF0aC5jb3MobmV4dEFuZ2xlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0WSA9IC1oZWFkRnJhbWVPdXRlclJhZGl1cyAqIE1hdGguc2luKG5leHRBbmdsZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50TWlkWCA9ICh4ICsgbmV4dFgpIC8gMjtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50TWlkWSA9ICh5ICsgbmV4dFkpIC8gMjtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50TGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHggLSBuZXh0WCwgMikgKyBNYXRoLnBvdyh5IC0gbmV4dFksIDIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoaGVhZEZyYW1lVGhpY2tuZXNzLCBzZWdtZW50TGVuZ3RoLCBoZWFkRnJhbWVEZXB0aCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudE1lc2ggPSBuZXcgVEhSRUUuTWVzaChzZWdtZW50R2VvbWV0cnksIGZyYW1lTWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIHNlZ21lbnRNZXNoLnBvc2l0aW9uLnNldChzZWdtZW50TWlkWCwgc2VnbWVudE1pZFksIDApO1xuICAgICAgICAgICAgICAgIHNlZ21lbnRNZXNoLnJvdGF0aW9uLnogPSBNYXRoLmF0YW4yKG5leHRZIC0geSwgbmV4dFggLSB4KSAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwuYWRkKHNlZ21lbnRNZXNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8g44Ks44OD44OI5o+P55S7IFxuICAgICAgICBjb25zdCBzdHJpbmdHYXBYID0gMC4xNTtcbiAgICAgICAgY29uc3Qgc3RyaW5nR2FwWSA9IDAuMTU7XG4gICAgICAgIGNvbnN0IHN0cmluZ1RoaWNrbmVzcyA9IDAuMDI7XG4gICAgICAgIGNvbnN0IHN0cmluZ0RlcHRoID0gaGVhZEZyYW1lRGVwdGggKiAxLjU7XG5cbiAgICAgICAgLy8g44Ks44OD44OI44KS5o+P55S744GZ44KL5a6f6Zqb44Gu56+E5ZuyXG4gICAgICAgIGNvbnN0IHN0cmluZ1BsYXlBcmVhWCA9IGVmZmVjdGl2ZUlubmVyUmFkaXVzWCAqIDIgLSBzdHJpbmdUaGlja25lc3M7IC8vIFjmlrnlkJHjga7jgqzjg4Pjg4jjga7mj4/nlLvlj6/og73luYVcbiAgICAgICAgY29uc3Qgc3RyaW5nUGxheUFyZWFZID0gZWZmZWN0aXZlSW5uZXJSYWRpdXNZICogMiAtIHN0cmluZ1RoaWNrbmVzczsgLy8gWeaWueWQkeOBruOCrOODg+ODiOOBruaPj+eUu+WPr+iDvemrmOOBlVxuXG4gICAgICAgIC8vIOWeguebtOaWueWQkeOCrOODg+ODiFxuICAgICAgICBjb25zdCBudW1WZXJ0aWNhbFN0cmluZ3MgPSBNYXRoLmZsb29yKHN0cmluZ1BsYXlBcmVhWCAvIHN0cmluZ0dhcFgpO1xuICAgICAgICBmb3IgKGxldCBpID0gLW51bVZlcnRpY2FsU3RyaW5ncyAvIDI7IGkgPD0gbnVtVmVydGljYWxTdHJpbmdzIC8gMjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB4UG9zID0gaSAqIHN0cmluZ0dhcFg7XG4gICAgICAgICAgICAvLyBY5L2N572u44Gr5b+c44GY44GfWeOBruacgOWkp+WApO+8iOODleODrOODvOODoOWGheWBtO+8ieOCkuioiOeul1xuICAgICAgICAgICAgY29uc3QgbWF4WSA9IE1hdGguc3FydChNYXRoLnBvdyhlZmZlY3RpdmVJbm5lclJhZGl1c1ksIDIpIC0gTWF0aC5wb3coeFBvcywgMikpO1xuICAgICAgICAgICAgaWYgKGlzTmFOKG1heFkpKSBjb250aW51ZTsgLy8g6KiI566X5LiN6IO944Gq5aC05ZCI44Gv44K544Kt44OD44OXXG5cbiAgICAgICAgICAgIGNvbnN0IHN0cmluZ0xlbmd0aCA9IChtYXhZICogMikgLSBzdHJpbmdUaGlja25lc3M7IC8vIOOCrOODg+ODiOOBruWkquOBleOCkuiAg+aFruOBl+OBpumVt+OBleOCkuiqv+aVtFxuXG4gICAgICAgICAgICBpZiAoc3RyaW5nTGVuZ3RoID4gMCkgeyAvLyDplbfjgZXjgYzmraPjga7loLTlkIjjga7jgb/mj4/nlLtcbiAgICAgICAgICAgICAgICBjb25zdCBzdHJpbmdHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShzdHJpbmdUaGlja25lc3MsIHN0cmluZ0xlbmd0aCwgc3RyaW5nRGVwdGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ01lc2ggPSBuZXcgVEhSRUUuTWVzaChzdHJpbmdHZW9tZXRyeSwgc3RyaW5nTWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIHN0cmluZ01lc2gucG9zaXRpb24uc2V0KHhQb3MsIDAsIDApO1xuICAgICAgICAgICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwuYWRkKHN0cmluZ01lc2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5rC05bmz5pa55ZCR44Ks44OD44OIXG4gICAgICAgIGNvbnN0IG51bUhvcml6b250YWxTdHJpbmdzID0gTWF0aC5mbG9vcihzdHJpbmdQbGF5QXJlYVkgLyBzdHJpbmdHYXBZKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IC1udW1Ib3Jpem9udGFsU3RyaW5ncyAvIDI7IGkgPD0gbnVtSG9yaXpvbnRhbFN0cmluZ3MgLyAyOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHlQb3MgPSBpICogc3RyaW5nR2FwWTtcbiAgICAgICAgICAgIC8vIFnkvY3nva7jgavlv5zjgZjjgZ9Y44Gu5pyA5aSn5YCk77yI44OV44Os44O844Og5YaF5YG077yJ44KS6KiI566XXG4gICAgICAgICAgICBjb25zdCBtYXhYID0gTWF0aC5zcXJ0KE1hdGgucG93KGVmZmVjdGl2ZUlubmVyUmFkaXVzWCwgMikgLSBNYXRoLnBvdyh5UG9zLCAyKSk7XG4gICAgICAgICAgICBpZiAoaXNOYU4obWF4WCkpIGNvbnRpbnVlOyAvLyDoqIjnrpfkuI3og73jgarloLTlkIjjga/jgrnjgq3jg4Pjg5dcblxuICAgICAgICAgICAgY29uc3Qgc3RyaW5nTGVuZ3RoID0gKG1heFggKiAyKSAtIHN0cmluZ1RoaWNrbmVzczsgLy8g44Ks44OD44OI44Gu5aSq44GV44KS6ICD5oWu44GX44Gm6ZW344GV44KS6Kq/5pW0XG5cbiAgICAgICAgICAgIGlmIChzdHJpbmdMZW5ndGggPiAwKSB7IC8vIOmVt+OBleOBjOato+OBruWgtOWQiOOBruOBv+aPj+eUu1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ0dlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHN0cmluZ0xlbmd0aCwgc3RyaW5nVGhpY2tuZXNzLCBzdHJpbmdEZXB0aCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyaW5nTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHN0cmluZ0dlb21ldHJ5LCBzdHJpbmdNYXRlcmlhbCk7XG4gICAgICAgICAgICAgICAgc3RyaW5nTWVzaC5wb3NpdGlvbi5zZXQoMCwgeVBvcywgMCk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZW5uaXNSYWNrZXRNb2RlbC5hZGQoc3RyaW5nTWVzaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aHJvYXRHZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMSwgMC4xLCAwLjgsIDE2KTtcbiAgICAgICAgY29uc3QgcmFja2V0VGhyb2F0ID0gbmV3IFRIUkVFLk1lc2godGhyb2F0R2VvbWV0cnksIHRocm9hdE1hdGVyaWFsKTtcbiAgICAgICAgcmFja2V0VGhyb2F0LnBvc2l0aW9uLnkgPSAtaGVhZEZyYW1lT3V0ZXJSYWRpdXMgLSAwLjQ7XG4gICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwuYWRkKHJhY2tldFRocm9hdCk7XG5cblxuICAgICAgICBjb25zdCBncmlwR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjE1LCAwLjE1LCAxLjUsIDE2KTtcbiAgICAgICAgY29uc3QgcmFja2V0R3JpcCA9IG5ldyBUSFJFRS5NZXNoKGdyaXBHZW9tZXRyeSwgZ3JpcE1hdGVyaWFsKTtcbiAgICAgICAgcmFja2V0R3JpcC5wb3NpdGlvbi55ID0gcmFja2V0VGhyb2F0LnBvc2l0aW9uLnkgLSAoMC44IC8gMikgLSAoMS41IC8gMik7IFxuXG4gICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwuYWRkKHJhY2tldEdyaXApO1xuXG4gICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwuc2NhbGUuc2V0KDEuNSwgMS41LCAxLjUpO1xuICAgICAgICB0aGlzLnRlbm5pc1JhY2tldE1vZGVsLnF1YXRlcm5pb24uY29weSh0aGlzLmN1cnJlbnRSYWNrZXRRdWF0ZXJuaW9uKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwudHJhdmVyc2UoKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUSFJFRS5NZXNoKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY2hpbGQucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy50ZW5uaXNSYWNrZXRNb2RlbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGVubmlzIHJhY2tldCBjcmVhdGVkIHByb2NlZHVyYWxseSBhbmQgYWRkZWQgdG8gc2NlbmUuXCIpO1xuXG4gICAgICAgIGNvbnN0IGluaXRpYWxSYWNrZXRYID0gMDsgXG4gICAgICAgIGNvbnN0IGluaXRpYWxSYWNrZXRZID0gMTsgXG4gICAgICAgIGNvbnN0IGluaXRpYWxSYWNrZXRaID0gMTI7IFxuXG4gICAgICAgIHRoaXMudGVubmlzUmFja2V0TW9kZWwucG9zaXRpb24uc2V0KGluaXRpYWxSYWNrZXRYLCBpbml0aWFsUmFja2V0WSwgaW5pdGlhbFJhY2tldFopO1xuXG5cbiAgICAgICAgY29uc3QgcmFja2V0SGVhZFdpZHRoUGh5c2ljcyA9IGhlYWRGcmFtZU91dGVyUmFkaXVzICogMiAqIHRoaXMudGVubmlzUmFja2V0TW9kZWwuc2NhbGUueDtcbiAgICAgICAgY29uc3QgcmFja2V0SGVhZEhlaWdodFBoeXNpY3MgPSBoZWFkRnJhbWVPdXRlclJhZGl1cyAqIDIgKiB0aGlzLnRlbm5pc1JhY2tldE1vZGVsLnNjYWxlLnk7XG4gICAgICAgIGNvbnN0IHJhY2tldEhlYWREZXB0aFBoeXNpY3MgPSBoZWFkRnJhbWVEZXB0aCAqIHRoaXMudGVubmlzUmFja2V0TW9kZWwuc2NhbGUuejtcblxuICAgICAgICBjb25zdCByYWNrZXRIZWFkU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMocmFja2V0SGVhZFdpZHRoUGh5c2ljcyAvIDIsIHJhY2tldEhlYWRIZWlnaHRQaHlzaWNzIC8gMiwgcmFja2V0SGVhZERlcHRoUGh5c2ljcyAvIDIpKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2Fubm9uUmFja2V0Qm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAwLFxuICAgICAgICAgICAgdHlwZTogQ0FOTk9OLkJvZHkuS0lORU1BVElDLFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMyhpbml0aWFsUmFja2V0WCwgaW5pdGlhbFJhY2tldFksIGluaXRpYWxSYWNrZXRaKSwgXG4gICAgICAgICAgICBzaGFwZTogcmFja2V0SGVhZFNoYXBlLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMucmFja2V0TWF0ZXJpYWxQaHlzaWNzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNhbm5vblJhY2tldEJvZHkucXVhdGVybmlvbi5jb3B5KHRoaXMudGVubmlzUmFja2V0TW9kZWwucXVhdGVybmlvbik7XG4gICAgICAgIHRoaXMuY2Fubm9uV29ybGQuYWRkQm9keSh0aGlzLmNhbm5vblJhY2tldEJvZHkpO1xuXG5cbiAgICAgICAgY29uc3QgdGVubmlzQmFsbEdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KHRoaXMudGVubmlzQmFsbFJhZGl1cywgMzIsIDMyKTtcbiAgICAgICAgY29uc3QgdGVubmlzQmFsbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgICAgIGNvbG9yOiAweGNjZmYwMCxcbiAgICAgICAgICAgIHJvdWdobmVzczogMC44LFxuICAgICAgICAgICAgbWV0YWxuZXNzOiAwLjFcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGVubmlzQmFsbCA9IG5ldyBUSFJFRS5NZXNoKHRlbm5pc0JhbGxHZW9tZXRyeSwgdGVubmlzQmFsbE1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy50ZW5uaXNCYWxsLnBvc2l0aW9uLnNldCgwLCAwLjUsIDUpOyBcbiAgICAgICAgdGhpcy50ZW5uaXNCYWxsLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnRlbm5pc0JhbGwpO1xuXG4gICAgICAgIGNvbnN0IGJhbGxTaGFwZSA9IG5ldyBDQU5OT04uU3BoZXJlKHRoaXMudGVubmlzQmFsbFJhZGl1cyk7XG4gICAgICAgIHRoaXMuY2Fubm9uQmFsbEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzModGhpcy50ZW5uaXNCYWxsLnBvc2l0aW9uLngsIHRoaXMudGVubmlzQmFsbC5wb3NpdGlvbi55LCB0aGlzLnRlbm5pc0JhbGwucG9zaXRpb24ueiksXG4gICAgICAgICAgICBzaGFwZTogYmFsbFNoYXBlLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuYmFsbE1hdGVyaWFsLCBcbiAgICAgICAgICAgIHR5cGU6IENBTk5PTi5Cb2R5LlNUQVRJQ1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYW5ub25Xb3JsZC5hZGRCb2R5KHRoaXMuY2Fubm9uQmFsbEJvZHkpO1xuXG4gICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDAuNSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldCg1LCA1LCA1KS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG4gICAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDEwLCAyMCkpOyBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcblxuICAgIHZpZXdwb3J0LnRhYkluZGV4ID0gMTtcbiAgICB2aWV3cG9ydC5mb2N1cygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BhY2Uga2V5IHByZXNzZWQhIExhdW5jaGluZyBiYWxsIHdpdGggQ2Fubm9uLmpzIVwiKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5jYW5ub25CYWxsQm9keS5wb3NpdGlvbi5zZXQoMCwgMC41LCA1KTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5jYW5ub25CYWxsQm9keS52ZWxvY2l0eS5zZXQoMCwgMCwgMCk7XG4gICAgICAgICAgICBjb250YWluZXIuY2Fubm9uQmFsbEJvZHkuYW5ndWxhclZlbG9jaXR5LnNldCgwLCAwLCAwKTtcblxuICAgICAgICAgICAgY29udGFpbmVyLmNhbm5vbkJhbGxCb2R5LnR5cGUgPSBDQU5OT04uQm9keS5EWU5BTUlDO1xuXG4gICAgICAgICAgICBjb250YWluZXIuY2Fubm9uQmFsbEJvZHkudmVsb2NpdHkuc2V0KDAsIDcsIC0xOCk7IFxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09ICdLZXlSJykgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUiBrZXkgcHJlc3NlZCEgUmVzZXR0aW5nIGJhbGwgYW5kIGhpdCBjb3VudC5cIik7XG4gICAgICAgICAgICBjb250YWluZXIuY2Fubm9uQmFsbEJvZHkucG9zaXRpb24uc2V0KDAsIDAuNSwgNSk7IFxuICAgICAgICAgICAgY29udGFpbmVyLmNhbm5vbkJhbGxCb2R5LnZlbG9jaXR5LnNldCgwLCAwLCAwKTsgICAgIFxuICAgICAgICAgICAgY29udGFpbmVyLmNhbm5vbkJhbGxCb2R5LmFuZ3VsYXJWZWxvY2l0eS5zZXQoMCwgMCwgMCk7IFxuICAgICAgICAgICAgY29udGFpbmVyLmNhbm5vbkJhbGxCb2R5LnR5cGUgPSBDQU5OT04uQm9keS5TVEFUSUM7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb250YWluZXIucmVzZXRIaXRDb3VudCgpOyBcbiAgICAgICAgfVxuICAgIH0pO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
