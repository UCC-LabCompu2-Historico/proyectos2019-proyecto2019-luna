//VARIABLES
var cadena = "",
    entrada=null,
    reporteO=null,
    ancho=parseFloat(400),
    alto=parseFloat(ancho),
    x=parseFloat(ancho/2),
    y=parseFloat(alto/2),
    valorT=parseFloat(ancho);
pixel = 1,
    ok = false,
    parentesisCerrado = true,
    scala = 1,
    translatePos = null;

/**
 * FUNCION QUE DIBUJA EL PLANO
 * @method dibujarPlano
 */

function dibujarPlano(){
    ctx.beginPath();
    ctx.font = "bold 15pt Verdana";
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';

    ctx.strokeText("-X",0,y+5);
    ctx.strokeText("X",ancho-15,y+5);
    ctx.strokeText("Y",x-7,15);
    ctx.strokeText("-Y",x-13,alto-1);

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#C1C1C1';

    v = 20;
    ctx.moveTo(v,y);
    ctx.lineTo(ancho-v,y);

    ctx.moveTo(x,v);
    ctx.lineTo(x,alto-v);

    ctx.stroke();
    ctx.closePath();

}

/**
 * FUNCION ENCARGADA DE CONCATENAR Y REACOMODAR LOS VALORES ENTRANTE
 * @method contatenar
 * @param {string}
 * @param {boolean}
 * @return {boolean}
 */

function concatenar(e){
    if(ok)
        limpiarTodo();
    valor = e.target.id;
    add = false;
    funcionTrigo= valor=="sen(" || valor=="cos(" || valor =="tan(" || valor=="√(" ? true: false;
    if(cadena!=""){
        ultimo = cadena.charAt(cadena.length-1);
        if(isNaN(valor) && isNaN(ultimo)){
            if(valor=="x" || valor=="+" || valor=="-" || valor==")" || valor=="X²" || funcionTrigo){
                add = true;
                if(ultimo==valor)
                    valor = "";
                else if(ultimo==")"){
                    if(funcionTrigo){
                        valor = valor.replace(valor, "*"+valor);
                    }
                    if(valor =="X²")
                        valor = valor.replace(valor, "*"+valor);
                }
                else if(ultimo=="("){
                    if(valor ==")"){
                        valor = valor.replace(valor, "x"+valor);
                        parentesisCerrado = true;
                    }
                }
                else if(ultimo=="x"){
                    if(funcionTrigo)
                        valor = valor.replace(valor, "*"+valor);
                    if(valor =="X²")
                        valor = valor.replace(valor, "*"+valor);
                    if(ultimo=="²")
                        valor = valor.replace(valor, "*"+valor);
                }
                else if(ultimo=="*" || ultimo =="/"){
                    if(valor=="+" || valor =="-")
                    add = true;
                }
                else if(ultimo=="+" || ultimo =="-"){
                    if(valor =="X²")
                        add = true;
                }
                else if(ultimo == "²"){
                    if(valor ==")")
                        add = true;
                }
                else if(ultimo!=")" || ultimo!="(" )
                    add = false;
            }
            else if(valor=="*" || valor=="/"){
                if(ultimo=="x")
                    add = true;
            }
        }
        else if(!isNaN(ultimo)){
            add = true;
            if(funcionTrigo || valor =="x")
                valor = valor.replace(valor, "*"+valor);
            else if(valor=="(" || (valor==")" && parentesisCerrado))
                add=false;
            else if(valor == "X²")
                valor = valor.replace(valor, "*"+valor);

        }
        else if(isNaN(ultimo)){
            if(ultimo==")" || ultimo=="x")
                valor = valor.replace(valor, "*"+valor);
            add=true;
        }
    }
    else if(valor!="*" && valor!="/" && valor != ")" && valor !="."){
        add = true;
    }
    if(funcionTrigo){
        parentesisCerrado = parentesisCerrado ? false:true;
        add = parentesisCerrado?false:true;
    }
    if(add){
        cadena+=valor;
        entrada.value = cadena;
    }
}

/**
 * Identifica si los parentesis estan completos
 * @method {revizarparentesis}
 * @param {string}
 * @return {boolean}
 */

function revizarParentesis(funcion){
    n =0;
    for(i = 0 ; i<funcion.length ;i++){
        caracter=funcion.charAt(i);
        n = caracter=="(" ? n+1 :n;
        n = caracter==")" ? n-1 :n;
    }
    if(n == 0)
        return true;
    else
        return false;
}

/**
 * resuelve la parte del SEN, COS y TAN
 * @method funcionesSenCostan
 * @param funcion
 * @param salir {boolean}
 * @return {*}
 */
//RESUELVE LA PARTE DEL SEN, COS, TAN
function funcionesSenCosTan(funcion){
    salir = false;
    while(!salir){
        identidadT =funcion.indexOf("sen")>-1?"sen":null;
        identidadT =funcion.indexOf("cos")>-1?"cos":identidadT;
        identidadT =funcion.indexOf("tan")>-1?"tan":identidadT;
        posIdentidad = funcion.indexOf(identidadT);
        if(posIdentidad>-1){
            posIdentidad+=4;
            caracter = funcion.charAt(posIdentidad)
            v = "", v2=caracter;
            numPare=1;
            while(caracter!=""){
                if(caracter!=")" && caracter!="(")
                    v+=caracter
                posIdentidad++;
                caracter = funcion.charAt(posIdentidad)

                numPare = caracter == "(" ?  numPare+1 : numPare;
                numPare = caracter == ")" ?  numPare-1 : numPare;
                caracter = numPare == 0 ? "" : caracter;

                if(numPare!=0)
                    v2+=caracter;
            }
            res = eval(v);
            if(identidadT=="sen")
                funcion = funcion.replace(identidadT+'('+v2+')',"1*"+Math.sin(res));
            else if(identidadT=="cos")
                funcion = funcion.replace(identidadT+'('+v+')',"1*"+Math.cos(res));
            else if(identidadT=="tan")
                funcion = funcion.replace(identidadT+'('+v+')',"1*"+Math.tan(res));
        }
        else
            salir = true;
    }
    return funcion;
}

/**
 * Resuelve la parte de la raiz
 * @method funcionRaiz
 * @param funcion
 * @param salir {boolean}
 * @return {*}
 */

function funcionRaiz(funcion){
    salir = false;
    while(!salir){
        raiz = funcion.indexOf("√");
        if(raiz>-1){
            raiz++;
            v = "";v2="";
            caracter = funcion.charAt(raiz)
            numPare=1;
            while(caracter!=""){
                if(caracter!=")" && caracter!="(")
                    v+=caracter
                raiz++;
                caracter = funcion.charAt(raiz)

                numPare = caracter == "(" ?  numPare+1 : numPare;
                numPare = caracter == ")" ?  numPare-1 : numPare;
                caracter = numPare == 0 ? "" : caracter;

                if(numPare!=0)
                    v2+=caracter;
            }
            res = eval(v);
            res= res < 0 ? eval(-1*res):res;
            res = Math.sqrt(res);
            funcion = funcion.replace("√("+v2+")","1*"+res);
        }
        else
            salir=true;
    }
    return funcion;
}

/**
 * funcion encargada de adaptar la funcion pasada por parametro para poder graficarla
 * @method dibujar
 * @param funcion
 */

function dibujar(funcion){
    limpiarCanvas();
    //REMPLAZAR VALORES
    if(funcion.indexOf("x")>-1)
        funcion = funcion.replace(/x/g,"1*x");
    if(funcion.indexOf("X²")>-1)
        funcion = funcion.replace(/X²/g,"1*(x*x)");
    while(funcion.indexOf("(*")>-1)
        funcion = funcion.replace('(*',"(");

    ctx.beginPath();
    j = 0;
    reporte = new Array();
    funcionOriginal = funcion;
    //DETERMINAR SI LA FUNCION CONTIENE SEN, COS, TAN
    funcionTrigo= funcion.indexOf("sen")>-1 || funcion.indexOf("cos")>-1 || funcion.indexOf("tan")>-1 ? true: false;
    //DETERMINAR SI LA FUNCION TIENE RAIZ
    tieneRaiz = funcion.indexOf("√")>-1?true:false;
    for(i = -valorT ; i < valorT ; i+=pixel){
        funcion = funcionOriginal;
        funcion = funcion.replace(/x/g,i);
        //ACOMODAR LA FUNCION SI TIENE RAIZ
        funcion = tieneRaiz ? funcionRaiz(funcion):funcion;
        //ACOMODA LA FUNCION SI TIENE SEN , COS ,TAN
        funcion = funcionTrigo ? funcionesSenCosTan(funcion):funcion;

        funcion = funcion.replace(/x/g,i);
        res = eval(funcion);
        res = eval(y+(res*-1)) ;
        ejeX = x+i;
        if(i == -valorT)
            ctx.moveTo(ejeX,res);
        ctx.lineTo(ejeX,res);
        //IMPRIME EL REPORTE X, Y SOLAMENTE IMPRIME DE -10 A +10
        if(i>-11 && i<11) {
            res2=parseFloat(y-res)+"";
            reporte[j] =parseFloat(i)+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+res2.substring(0,4);
            j++;
        }
    }
    graficar();
    ctx.closePath();
    imprimirReporte(cadena, reporte);
}


/**
 * Funcion que asigna parametros de estilo de dibujo para la grafica
 * @method graficar
 */

function graficar(){
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}


/**
 * Imprime el reporte de las variables X e Y, y la funcion solo cuando se grafica
 * @method ImprimirReporte
 * @param funcion
 * @param arrayReporte
 */

function imprimirReporte(funcion ,arrayReporte){
    reporteO.innerHTML="";
    reporteO.innerHTML+="Ecuación: "+funcion+"<br>X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y<br><br>";
    for(i =0 ; i< arrayReporte.length ; i++)
        reporteO.innerHTML+=arrayReporte[i]+"<br>";
    reporteO.style.display="inherit"
}

/**
 * limpiar todo en pantalla
 * @method LimpiarTodo
 * @param repotteO {null}
 * @param entrada {null}
 * @param cadena {string}
 * @param ok {boolean}
 */
function limpiarTodo(){
    reporteO.innerHTML="";
    reporteO.style.display="none";
    entrada.value="";
    resultado.value="";
    cadena ="";
    limpiarCanvas();
    ok = false;
}

/**
 * Limpia el contenido del canvas y vuelve a dibujar el plano
 * @method Limpiarcanvas
 */

function limpiarCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarPlano();
}

/**
 * Funcion del boton igual
 * @method igual
 * @param ok {boolean}
 * @param cadena {string}
 */

function igual(){
    if(ok)
        limpiarTodo();
    if(cadena!="" && revizarParentesis(cadena)){
        if(sePuedeGraficar()){
            dibujar(cadena);
        }
        else{
            if(cadena.indexOf("√")>-1)
                calculadoraSimple(funcionRaiz(cadena));
            else if(cadena.indexOf("sen")>-1 || cadena.indexOf("cos")>-1 || cadena.indexOf("tan")>-1 )
                calculadoraSimple(funcionesSenCosTan(cadena))
            else
                calculadoraSimple(cadena);
        }
        ok=true;
    }
}

/**
 * Funcion para realizar las operaciones basicas
 * @method calduladoraSimple
 * @param funcion
 */
function calculadoraSimple(funcion){
    resul = eval(funcion);
    resultado.value = resul;
}

/**
 * Funcion que determina si se puede graficar o no ka funcion que viene por parametro
 * @method sePuedegraficar
 * @param graficarBoolean {boolean}
 * @param cadena {string}
 * @return {boolean}
 */

function sePuedeGraficar(){
    graficarBoolean = false;
    if(cadena!="")
        graficarBoolean = cadena.indexOf("x")>-1 || cadena.indexOf("X²")>-1 ? true: false;1
    return graficarBoolean;
}

/**
 * Funcion que permite eliminar el ultimo caracter de la cadena
 * @method del
 * @param ok {boolean}
 * @param cadena {string}
 */
function del(){
    if(ok)
        limpiarTodo();
    if(cadena!=""){
        cadena = cadena.substring(0,cadena.length-1);
        entrada.value = cadena;
    }
}
function cambiarSigno() {

}

/**
 * Funcion que permite al acroll hacer zoom
 * @method zoom
 * @param e
 */
function zoom(e){
    scaleMultiplier = 0.6;
    if(e.wheelDelta<0){
        scala /= scaleMultiplier;
        draw(scala, translatePos);
    }
    else{
        scala *= scaleMultiplier;
        draw(scala, translatePos);
    }

}

/**
 * Funcion para hacer escalamiento del canvas
 * @method draw
 */

function draw(scale, translatePos){
    if(sePuedeGraficar()){
        canvas = document.getElementById("canvas");
        canvas.width = ancho;
        canvas.height = alto;
        canvas.style.background="white";
        ctx = canvas.getContext("2d");
        ctx.save();
        ctx.translate(0, 0);
        ctx.scale(scale, scale);
        dibujar(cadena);
    }
}

/**
 * Funcion de carga los eventos del mouse.
 * @method funcionesMouse
 */
function funcionesMouse(){

    var startDragOffset = {};
    var mouseDown = false;

    canvas.addEventListener('mousewheel',zoom);

    canvas.addEventListener("mousedown", function(evt){
        mouseDown = true;
        startDragOffset.x = evt.clientX - translatePos.x;
        startDragOffset.y = evt.clientY - translatePos.y;
    });

    canvas.addEventListener("mouseup", function(evt){
        mouseDown = false;
    });

    canvas.addEventListener("mouseover", function(evt){
        mouseDown = false;
    });

    canvas.addEventListener("mouseout", function(evt){
        mouseDown = false;
    });

    canvas.addEventListener("mousemove", function(evt){
        if (mouseDown) {
            translatePos.x = evt.clientX - startDragOffset.x;
            translatePos.y = evt.clientY - startDragOffset.y;
            draw(scala, translatePos);
        }
    });

    //draw(scala, translatePos);
}
//CARGA TODOS LOS ELEMENTOS Y LES ASIGNA SUS FUNCIONES
function cargarDoc(){
    botones = document.getElementsByTagName("button");
    for(i = 0 ; i < botones.length ; i++){
        if(botones[i].id!="igual" && botones[i].id!="CE" && botones[i].id!="DEL" && botones[i].id!="±")
            botones[i].addEventListener("click",concatenar);
    }

    document.getElementById("igual").addEventListener("click",igual);
    document.getElementById("CE").addEventListener("click",limpiarTodo);
    document.getElementById("DEL").addEventListener("click",del);
    document.getElementById("±").addEventListener("click",cambiarSigno);

    anchoSection = ancho+50;
    document.getElementById("section").style.width=anchoSection+"px";

    entrada = document.getElementById("in");
    resultado = document.getElementById("res");
    sectionO = document.getElementById("section");
    reporteO = document.getElementById("reporte");
    reporteO.style.left=sectionO.offsetLeft-200+"px";

    canvas = document.getElementById("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    canvas.style.background="white";
    ctx = canvas.getContext("2d");
    ctx.save();
    translatePos = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    dibujarPlano();
    funcionesMouse();
}
window.addEventListener("load",cargarDoc);

//MENSAJE DE ERROR GLOBAL
window.onerror = function (msg, url, line, col, error) {
    var extra = !col ? '' : '\nColumna: ' + col;
    extra += !error ? '' : '\nError: ' + error;
    alert("Error: " + msg + "\nUrl: " + url + "\nlinea: " + line + extra);
    var errorAlerta = true;
    return errorAlerta;
}