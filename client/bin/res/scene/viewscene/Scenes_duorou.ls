{
	"version":"LAYASCENE3D:02",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"Scenes_duorou",
			"ambientColor":[
				0.4811321,
				0.2692286,
				0.1656728
			],
			"reflectionDecodingFormat":0,
			"reflection":"Assets/Scenes/Scenes_duorouGIReflection.ltcb",
			"reflectionIntensity":1,
			"ambientMode":0,
			"ambientSphericalHarmonicsIntensity":1,
			"lightmaps":[],
			"enableFog":true,
			"fogStart":3.35,
			"fogRange":1.45,
			"fogColor":[
				0.3999644,
				0.682556,
				0.7924528
			]
		},
		"child":[
			{
				"type":"Camera",
				"instanceID":0,
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":5,
					"position":[
						0.01,
						2.75,
						2.8
					],
					"rotation":[
						-0.299124,
						-1.7868E-07,
						-5.601202E-08,
						0.9542142
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":1,
					"orthographic":false,
					"orthographicVerticalSize":10,
					"fieldOfView":45,
					"enableHDR":true,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						0,
						0,
						0,
						0
					]
				},
				"components":[],
				"child":[
					{
						"type":"MeshSprite3D",
						"instanceID":1,
						"props":{
							"name":"Effect_Plane",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								-0.918,
								2.74
							],
							"rotation":[
								-1.986124E-07,
								-0.7071068,
								0.7071068,
								-1.986124E-07
							],
							"scale":[
								0.6922619,
								0.6922619,
								0.2062847
							],
							"meshPath":"Assets/res/Effect/Model/Effect_Plane-Effect_Plane.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/res/Scenes/Material/ui_test.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					}
				]
			},
			{
				"type":"Sprite3D",
				"instanceID":2,
				"props":{
					"name":"Object",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						0,
						0
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						1,
						1,
						1
					]
				},
				"components":[],
				"child":[
					{
						"type":"MeshSprite3D",
						"instanceID":3,
						"props":{
							"name":"HY_xingxing (6)",
							"active":true,
							"isStatic":true,
							"layer":0,
							"position":[
								-0.7,
								-0.011,
								0.33
							],
							"rotation":[
								-1.424737E-08,
								0.5053094,
								1.657359E-08,
								0.8629383
							],
							"scale":[
								1.338281,
								1.338279,
								1.338281
							],
							"meshPath":"Assets/res/Scenes/model/HY_xingxing-DR_xingxing.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/res/Scenes/Material/HY_yueliang.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"ShuriKenParticle3D",
						"instanceID":4,
						"props":{
							"name":"Particle System",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0.483,
								0
							],
							"rotation":[
								0.7071068,
								0,
								0,
								-0.7071068
							],
							"scale":[
								1,
								1,
								1
							],
							"main":{
								"randomSeed":0,
								"bases":{
									"isPerformanceMode":true,
									"startSpeedConstant":0.1,
									"startSpeedConstantMax":0.1,
									"startSizeType":2,
									"startSizeConstant":0.03,
									"startSizeConstantMin":0.01,
									"startSizeConstantMax":0.03,
									"startColorType":2,
									"maxParticles":10
								},
								"vector3s":{
									"startSizeConstantSeparate":[
										0.03,
										1,
										1
									],
									"startSizeConstantMinSeparate":[
										0.01,
										1,
										1
									],
									"startSizeConstantMaxSeparate":[
										0.03,
										1,
										1
									]
								},
								"vector4s":{
									"startColorConstant":[
										1,
										0.9309359,
										0.5137255,
										1
									],
									"startColorConstantMin":[
										1,
										0.8764906,
										0.7216981,
										1
									],
									"startColorConstantMax":[
										1,
										0.9309359,
										0.5137255,
										1
									]
								}
							},
							"emission":{
								"bases":{
									"enable":true
								}
							},
							"shape":{
								"shapeType":3,
								"bases":{
									"enable":true,
									"x":1.5,
									"y":1.5,
									"z":1.31
								}
							},
							"renderer":{
								"resources":{
									"material":"Assets/res/Effect/Material/E_yuan02.lmat"
								}
							}
						},
						"components":[],
						"child":[]
					},
					{
						"type":"ShuriKenParticle3D",
						"instanceID":5,
						"props":{
							"name":"Particle System (1)",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.097,
								1.089,
								-1.222
							],
							"rotation":[
								0.7071068,
								0,
								0,
								-0.7071068
							],
							"scale":[
								1,
								1,
								1
							],
							"main":{
								"randomSeed":0,
								"bases":{
									"isPerformanceMode":true,
									"duration":10,
									"startLifetimeType":2,
									"startLifetimeConstant":10,
									"startLifetimeConstantMin":5,
									"startLifetimeConstantMax":10,
									"startSpeedConstant":0.01,
									"startSpeedConstantMax":0.01,
									"startSizeType":2,
									"startSizeConstant":5,
									"startSizeConstantMin":0.5,
									"startSizeConstantMax":5,
									"startColorType":2,
									"maxParticles":10
								},
								"vector3s":{
									"startSizeConstantSeparate":[
										5,
										1,
										1
									],
									"startSizeConstantMinSeparate":[
										0.5,
										1,
										1
									],
									"startSizeConstantMaxSeparate":[
										5,
										1,
										1
									]
								},
								"vector4s":{
									"startColorConstant":[
										0.1903702,
										0.4744356,
										0.5849056,
										1
									],
									"startColorConstantMin":[
										0.3871929,
										0.6314328,
										0.7264151,
										1
									],
									"startColorConstantMax":[
										0.1903702,
										0.4744356,
										0.5849056,
										1
									]
								}
							},
							"emission":{
								"bases":{
									"enable":true
								}
							},
							"shape":{
								"shapeType":3,
								"bases":{
									"enable":true,
									"radius":2,
									"angle":0.03490658,
									"x":3.185647,
									"y":0.33,
									"z":1.517357
								}
							},
							"colorOverLifetime":{
								"bases":{
									"enable":true
								},
								"color":{
									"type":1,
									"gradient":{
										"alphas":[
											{
												"key":0,
												"value":0
											},
											{
												"key":0.2676432,
												"value":1
											},
											{
												"key":0.7411765,
												"value":1
											},
											{
												"key":1,
												"value":0
											}
										]
									},
									"gradientMax":{
										"alphas":[
											{
												"key":0,
												"value":0
											},
											{
												"key":0.2676432,
												"value":1
											},
											{
												"key":0.7411765,
												"value":1
											},
											{
												"key":1,
												"value":0
											}
										]
									}
								}
							},
							"renderer":{
								"resources":{
									"material":"Assets/res/Effect/Material/E_yuan02.lmat"
								}
							}
						},
						"components":[],
						"child":[]
					},
					{
						"type":"ShuriKenParticle3D",
						"instanceID":6,
						"props":{
							"name":"Particle System (2)",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.02,
								1.074,
								-1.243
							],
							"rotation":[
								0.7071068,
								0,
								0,
								-0.7071068
							],
							"scale":[
								1,
								1,
								1
							],
							"main":{
								"randomSeed":0,
								"bases":{
									"isPerformanceMode":true,
									"duration":10,
									"startLifetimeType":2,
									"startLifetimeConstant":10,
									"startLifetimeConstantMin":5,
									"startLifetimeConstantMax":10,
									"startSpeedConstant":0.05,
									"startSpeedConstantMax":0.05,
									"startSizeType":2,
									"startSizeConstant":0.8,
									"startSizeConstantMin":0.05,
									"startSizeConstantMax":0.8,
									"startColorType":2,
									"maxParticles":5
								},
								"vector3s":{
									"startSizeConstantSeparate":[
										0.8,
										1,
										1
									],
									"startSizeConstantMinSeparate":[
										0.05,
										1,
										1
									],
									"startSizeConstantMaxSeparate":[
										0.8,
										1,
										1
									]
								},
								"vector4s":{
									"startColorConstant":[
										0.5168654,
										0.83076,
										0.9528302,
										1
									],
									"startColorConstantMin":[
										0.4559452,
										0.7661551,
										0.8867924,
										1
									],
									"startColorConstantMax":[
										0.5168654,
										0.83076,
										0.9528302,
										1
									]
								}
							},
							"emission":{
								"bases":{
									"enable":true,
									"emissionRate":5
								}
							},
							"shape":{
								"shapeType":3,
								"bases":{
									"enable":true,
									"angle":0.01745329,
									"x":2.033126,
									"y":0.33,
									"z":0.8245326
								}
							},
							"colorOverLifetime":{
								"bases":{
									"enable":true
								},
								"color":{
									"type":1,
									"gradient":{
										"alphas":[
											{
												"key":0,
												"value":0
											},
											{
												"key":0.2676432,
												"value":1
											},
											{
												"key":0.7411765,
												"value":1
											},
											{
												"key":1,
												"value":0
											}
										]
									},
									"gradientMax":{
										"alphas":[
											{
												"key":0,
												"value":0
											},
											{
												"key":0.2676432,
												"value":1
											},
											{
												"key":0.7411765,
												"value":1
											},
											{
												"key":1,
												"value":0
											}
										]
									}
								}
							},
							"renderer":{
								"resources":{
									"material":"Assets/res/Effect/Material/E_yuan02.lmat"
								}
							}
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":7,
						"props":{
							"name":"dimian",
							"active":true,
							"isStatic":true,
							"layer":0,
							"position":[
								0.002955195,
								0,
								-0.01006011
							],
							"rotation":[
								-2.179381E-08,
								-0.07520279,
								1.643609E-09,
								-0.9971683
							],
							"scale":[
								26.45292,
								26.45292,
								26.45292
							],
							"meshPath":"Assets/res/Effect/Model/Effect_Plane-Effect_Plane.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/res/Scenes/Material/HY_dimian02.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":8,
						"props":{
							"name":"DR_xiaochanzi",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0.6896,
								0.111,
								0.33
							],
							"rotation":[
								-0.5008137,
								0.0852192,
								0.1633213,
								-0.8457243
							],
							"scale":[
								1.632182,
								1.632181,
								1.632182
							],
							"meshPath":"Assets/res/Scenes/model/DR_xiaochanzi-DR_xiaochanzi.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/res/Scenes/Material/HY_02_03.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":9,
						"props":{
							"name":"HY_xingxing (3)",
							"active":true,
							"isStatic":true,
							"layer":0,
							"position":[
								-0.548,
								0.014,
								0.545
							],
							"rotation":[
								-1.919805E-08,
								-0.3758306,
								-1.044542E-08,
								0.9266884
							],
							"scale":[
								0.8241747,
								0.8241739,
								0.8241747
							],
							"meshPath":"Assets/res/Scenes/model/HY_xingxing-DR_xingxing.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/res/Scenes/Material/HY_xingxing.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"Sprite3D",
						"instanceID":10,
						"props":{
							"name":"Succulent_pen_woniu (1)",
							"active":true,
							"isStatic":false,
							"layer":5,
							"position":[
								0.6983641,
								0.2581438,
								0.2455709
							],
							"rotation":[
								0.5267931,
								-0.6695283,
								-0.2865482,
								-0.4383048
							],
							"scale":[
								0.9336607,
								0.9336607,
								0.933661
							]
						},
						"components":[
							{
								"type":"Animator",
								"layers":[
									{
										"name":"Base Layer",
										"weight":0,
										"blendingMode":0,
										"states":[
											{
												"name":"idle",
												"clipPath":"Assets/res/Animation/Body/Role/Succulent_pen_woniu/Succulent_pen_woniu_idle-Take 001.lani"
											}
										]
									}
								],
								"cullingMode":0,
								"playOnWake":true
							}
						],
						"child":[
							{
								"type":"Sprite3D",
								"instanceID":11,
								"props":{
									"name":"Dummy001",
									"active":true,
									"isStatic":false,
									"layer":5,
									"position":[
										3.627698E-11,
										0,
										0
									],
									"rotation":[
										-1.545431E-08,
										0.7071067,
										-1.545431E-08,
										-0.7071068
									],
									"scale":[
										1,
										1,
										1
									]
								},
								"components":[],
								"child":[
									{
										"type":"Sprite3D",
										"instanceID":12,
										"props":{
											"name":"Bone007",
											"active":true,
											"isStatic":false,
											"layer":5,
											"position":[
												0.09082258,
												0.007788397,
												-1.117587E-08
											],
											"rotation":[
												-4.236725E-10,
												8.742175E-08,
												0.9999883,
												-0.00484624
											],
											"scale":[
												1,
												1,
												1
											]
										},
										"components":[],
										"child":[
											{
												"type":"Sprite3D",
												"instanceID":13,
												"props":{
													"name":"Bone005",
													"active":true,
													"isStatic":false,
													"layer":5,
													"position":[
														0.1000989,
														-0.03472548,
														-7.450582E-09
													],
													"rotation":[
														-7.796842E-08,
														3.954326E-08,
														0.4523221,
														-0.8918546
													],
													"scale":[
														1,
														1,
														1
													]
												},
												"components":[],
												"child":[]
											},
											{
												"type":"Sprite3D",
												"instanceID":14,
												"props":{
													"name":"Bone008",
													"active":true,
													"isStatic":false,
													"layer":5,
													"position":[
														0.07545643,
														-6.332994E-08,
														-6.594869E-09
													],
													"rotation":[
														2.401692E-10,
														-4.41449E-08,
														-0.005440234,
														-0.9999852
													],
													"scale":[
														1,
														1,
														1
													]
												},
												"components":[],
												"child":[]
											}
										]
									}
								]
							},
							{
								"type":"SkinnedMeshSprite3D",
								"instanceID":15,
								"props":{
									"name":"Succulent_pen_woniu",
									"active":true,
									"isStatic":false,
									"layer":5,
									"position":[
										-0.334,
										0.077,
										0.081
									],
									"rotation":[
										-2.185569E-08,
										0,
										0,
										-1
									],
									"scale":[
										1,
										1,
										1
									],
									"rootBone":12,
									"boundBox":{
										"min":[
											-0.01648256,
											-0.1424442,
											-0.03696091
										],
										"max":[
											0.2062121,
											0.04498295,
											0.05969261
										]
									},
									"boundSphere":{
										"center":[
											0.09486478,
											-0.04873062,
											0.01136585
										],
										"radius":0.1533491
									},
									"bones":[
										14,
										13,
										12
									],
									"materials":[
										{
											"path":"Assets/res/Material/Succulent/Succulent_pen_woniu.lmat"
										}
									],
									"meshPath":"Assets/res/model/Succulent/Succulent_pen_woniu_skin-Succulent_pen_woniu.lm"
								},
								"components":[],
								"child":[]
							}
						]
					}
				]
			},
			{
				"type":"DirectionLight",
				"instanceID":16,
				"props":{
					"name":"Spot Light (1)",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						-0.08,
						6.61,
						-1.02
					],
					"rotation":[
						-0.372958,
						0.7007088,
						0.600751,
						0.09490944
					],
					"scale":[
						1,
						1,
						1
					],
					"intensity":1,
					"lightmapBakedType":0,
					"color":[
						1,
						0.8275339,
						0.5896226
					]
				},
				"components":[],
				"child":[]
			}
		]
	}
}