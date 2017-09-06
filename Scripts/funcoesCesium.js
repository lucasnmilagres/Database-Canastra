var indice = 0;
var property = new Cesium.SampledPositionProperty();

function testeInterpolacao()
{
    Cesium.BingMapsApi.defaultKey="AsByK24F0VpuzzRR_1SOnVm04BJ1K9ur5EPtESW09Ke9t-0bxGo23pY7C9v_h0_i";

    //Set bounds of our simulation time
    var today = new Date();
    var start = Cesium.JulianDate.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDay()));
    var stop = Cesium.JulianDate.addHours(start, 24, new Cesium.JulianDate());

    //Inicializa o viewer
    var viewer = inicializaViewer(start, stop);

    //Seleciona CEXEC da URL
    var url = window.location.href;
    var captured = /CEXEC=([^&]+)/.exec(url);
    var cexec
    if (captured == null)
        cexec = 'none';
    else
        cexec = captured[1];

    //Cria a entidade
    var entity = criarEntidade(viewer, start, stop)
   
    //Atribuição de eventos aos botões
    eventosBotoes(viewer, entity);

    //Configurar send server events
    eventoServidor(viewer, cexec);
}

//Inicializa o viewer
function inicializaViewer(start, stop)
{ 
    var viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProviderViewModels: [], //Disable terrain changing
        infoBox: false, //Disable InfoBox widget
        selectionIndicator: false //Disable selection indicator
    });

    //Enable lighting based on sun/moon positions
    viewer.scene.globe.enableLighting = true;

    //Use STK World Terrain
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: 'https://assets.agi.com/stk-terrain/world',
        requestWaterMask: true,
        requestVertexNormals: true
    });

    //Enable depth testing so things behind the terrain disappear.
    viewer.scene.globe.depthTestAgainstTerrain = true;

    //Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(3);

    //Make sure viewer is at the desired time.
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    viewer.clock.multiplier = 10;

    //Set timeline to simulation bounds
    viewer.timeline.zoomTo(start, stop);

    return viewer;
}

//Cria a entidade
function criarEntidade(viewer, start, stop)
{
    var entity=viewer.entities.add({

        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: start,
            stop: stop
        })]),

        //Use our computed positions
        position: property,

        //Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(property),

        //Load the Cesium plane model to represent the entity
        model: {
            uri: 'SampleData/models/CesiumAir/Cesium_Air.gltf',
            minimumPixelSize: 64
        },

        //Show the path as a pink line sampled in 1 second increments.
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW
            }),
            width: 10
        }
    });

    return entity;
}

//Atribuir eventos aos botões
function eventosBotoes(viewer, entity)
{
    var botaoVistaSuperior = document.getElementById("vistaSuperior");
    botaoVistaSuperior.addEventListener('click', function () { vistaSuperior(viewer, entity) }, false);
    var botaoVistaLateral = document.getElementById("vistaLateral");
    botaoVistaLateral.addEventListener('click', function () { vistaLateral(viewer, entity) }, false);
    var botaoVistaDinamica = document.getElementById("vistaDinamica");
    botaoVistaDinamica.addEventListener('click', function () { vistaDinamica(viewer, entity) }, false);
}

//Vista superior
function vistaSuperior(viewer, entity) {
    viewer.trackedEntity = entity;
    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
}

//Vista lateral
function vistaLateral(viewer, entity) {
    viewer.trackedEntity = entity;
    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500));
}

//Vista dinâmica
function vistaDinamica(viewer, entity) {
    viewer.trackedEntity = entity;
}

//Configurar send server events
function eventoServidor(viewer, cexec)
{
    if (typeof (EventSource) !== "undefined")
    {
        var link = 'Php/atualizarPontos.php?CEXEC=';
        link = link.concat(cexec);
        link = link.concat('&indice=');
        link = link.concat(indice);
        var source = new EventSource(link);
        source.onopen = function ()
        {
            //alert('Abriu');
        };
        source.onerror = function ()
        {
            //alert("Erro de comunicação com o servidor!");
        };
        source.onmessage = function (event)
        {
            atualizarPontos(event, viewer);
        };
    }
    else
    {
        alert("Sorry, your browser does not support server-sent events...");
    }
}

//Atualizar pontos
function atualizarPontos(event, viewer) {
    var jsonObj = JSON.parse(event.data);
    for (var i = 0; i < jsonObj.dados.length; i++) {
        plotarPontos(jsonObj.dados[i], viewer);

        if (jsonObj.dados[i].indice > indice)
            indice = jsonObj.dados[i].indice
    }
}

//Plotar pontos da trajetória
function plotarPontos(ponto, viewer) {
    var today = new Date();
    var time = Cesium.JulianDate.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDay(), ponto.hora - 3, ponto.minuto, ponto.segundo));
    var position = Cesium.Cartesian3.fromDegrees(ponto.longitude, ponto.latitude, ponto.altitude);
    property.addSample(time, position);

    //Also create a point for each sample we generate.
    viewer.entities.add({
        position: position,
        point: {
            pixelSize: 8,
            color: Cesium.Color.TRANSPARENT,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 3
        }
    });
}

