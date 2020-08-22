class Visualizador {
    element;
    images;
    currentPage = 1;
    scrollingTimer;
    height      = '707px';
    width       = '750px';

    layout = `
        <div id="visualizador-layout" >
            <div id="visualizador-left">{main}</div>
            <div id="visualizador-right">{barra}</div>
        </div>
    `;

    main = `
        <img id="visualizador-main" class="img-fluid" src="{src}" >
        <p id="visualizador-pie-de-pagina"></p>
    `;

    barra = `
        <div id="visualizador-barra">{paginas}</div>
    `;

    paginas = `
        <div class="visualizador-pagina" data-src="{src}" data-pagina="{pagina}">
            {img}
        </div>
    `;

    paginasImagen = `
       <img class="visualizador-pagina-imagen img-thumbnail" src="{src}" >
    `;


    constructor(str) {
        this.element = document.getElementById(str);
    }

    render() {
        this.element.innerHTML = '';
        let paginasImagen = [];
        let paginasElement = '';
        let i = 0;
        for(let imagen of this.images) {
            let imagenElement = this.paginasImagen.replace('{src}', imagen);
            paginasElement += this.paginas.replace('{src}', imagen).replace('{pagina}', (i + 1 )).replace('{img}', imagenElement);
            i++;
        }
        let barra   = this.barra.replace('{paginas}', paginasElement);
        let main    = this.main.replace('{src}', this.images[this.currentPage - 1]);
        let html    = this.layout.replace('{main}', main).replace('{barra}', barra);

        this.element.innerHTML = html;

        const paginasElements = document.getElementsByClassName('visualizador-pagina');
        for(let paginaElement of paginasElements) {
            paginaElement.addEventListener("click", () => {
                document.getElementById('visualizador-main').src = paginaElement.dataset['src'];
                this.currentPage = paginaElement.dataset['pagina'];
                document.getElementById('visualizador-pie-de-pagina').innerText = this.currentPage + ' / ' + this.images.length;

                // Limpiamos otros eventos.
                clearTimeout(this.scrollingTimer);
            });
        }
        document.getElementById('visualizador-pie-de-pagina').innerText = this.currentPage + ' / ' + this.images.length;

        // propiedades modificables.

        this.setSize();
    }

    scrollEvent() {
        document.getElementById('visualizador-right').addEventListener('scroll',
            () => {
                clearTimeout(this.scrollingTimer);
                this.scrollingTimer = setTimeout(
                    () => {
                        const y = document.getElementById('visualizador-right').scrollTop;

                        // Evaluamos cual es la página que corresponde.
                        const c = this.images.length;
                        const h = 230; // 200 del alto + 30 del padding.
                        const p = Math.floor((y + 30) / h) + 1;
                        this.currentPage = p;
                        document.getElementById('visualizador-main').src = this.images[this.currentPage - 1];
                        document.getElementById('visualizador-pie-de-pagina').innerText = this.currentPage + ' / ' + this.images.length;
                    }, 500
                );

            });
    }


    setImages(images) {
        if(images.length > 0) {
            this.images = images;
            return images.length;
        } else {
            return false;
        }
    }

   setSize(height = null, width = null) {
        height   && (this.height = height);
        width    && (this.width = width);
        document.getElementById('visualizador-layout').style.height = 'auto';
        document.getElementById('visualizador-layout').style.width = this.width;
        document.getElementById('visualizador-main').style.height = this.height;
   }
}

function visualizadorInit(str, images) {
    let visualizador = new Visualizador(str);
    visualizador.setImages(images);
    visualizador.render();
    return visualizador;
}
