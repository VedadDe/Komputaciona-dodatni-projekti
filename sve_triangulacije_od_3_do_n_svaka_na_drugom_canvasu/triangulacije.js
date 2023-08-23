        let vrhovi = [];

        function pronadjiTriangulacije(n) {
            if (n < 3) {
                throw new Error("Poligon mora imati najmanje 3 vrha za triangulaciju.");
            }

            if (n === 3) {
                return [[[1, 2], [2, 3], [1, 3]]];
            }

            let triangulacije = pronadjiTriangulacije(n - 1);
            let noveTriangulacije = [];

            for (let t of triangulacije) {
                let dijagonale = t.filter(par => par.includes(n - 1) && !par.includes(n));
                let dodano = {};

                for (let [i, k] of dijagonale) {
                    let novaTriangulacija = JSON.parse(JSON.stringify(t));

                    for (let par of novaTriangulacija) {
                        if (par[1] === n - 1 && par[0] < i) {
                            par[1] = n;
                        }
                    }

                    if (!dodano[i]) {
                        novaTriangulacija.push([i, n]);
                        novaTriangulacija.push([n - 1, n]);
                        noveTriangulacije.push(novaTriangulacija);
                        dodano[i] = true;
                    }
                }
            }

            return noveTriangulacije;
        }

        function dodajVrh(event) {
            const platno = document.getElementById("triangulationCanvas");
            const pravougaonik = platno.getBoundingClientRect();
            const x = event.clientX - pravougaonik.left;
            const y = event.clientY - pravougaonik.top;
            vrhovi.push([x, y]);

            const ctx = platno.getContext("2d");
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();

            if (vrhovi.length > 1) {
                ctx.beginPath();
                ctx.moveTo(vrhovi[vrhovi.length - 2][0], vrhovi[vrhovi.length - 2][1]);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }

        function zavrsiPoligon() {
            if (vrhovi.length < 3) {
                document.getElementById('output').textContent = "Molimo dodajte najmanje 3 vrha.";
                return;
            }

            const platno = document.getElementById("triangulationCanvas");
            const ctx = platno.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(vrhovi[vrhovi.length - 1][0], vrhovi[vrhovi.length - 1][1]);
            ctx.lineTo(vrhovi[0][0], vrhovi[0][1]);
            ctx.stroke();

            document.getElementById("triangulationCanvas").removeEventListener("click", dodajVrh);
        }


        function jeKonveksan(vrhovi) {
            let n = vrhovi.length;
            if (n < 3) return false;

            let znak = 0;

            for (let i = 0; i < n; i++) {
                let A = vrhovi[i];
                let B = vrhovi[(i + 1) % n];
                let C = vrhovi[(i + 2) % n];

                let BAx = A[0] - B[0];
                let BAy = A[1] - B[1];
                let BCx = C[0] - B[0];
                let BCy = C[1] - B[1];

                let z = BAx * BCy - BAy * BCx;

                if (z < 0) {
                    if (znak > 0) return false;
                    znak = -1;
                } else if (z > 0) {
                    if (znak < 0) return false;
                    znak = 1;
                }
            }

            return true;
        }

function prikaziSveTriangulacije() {
    if (vrhovi.length < 3) {
        alert("Molimo dodajte najmanje 3 vrha.");
        return;
    }
    if (!jeKonveksan(vrhovi)) {
        alert("Poligon nije konveksan!");
        return;
    } 

    for (let i = 3; i <= vrhovi.length; i++) {
        let potskupVrhova = vrhovi.slice(0, i);
        const triangulacije = pronadjiTriangulacije(i);

        triangulacije.forEach(triangulacija => {
            let newCanvas = document.createElement('canvas');
            newCanvas.width = 500;
            newCanvas.height = 500;
            newCanvas.style.border = "1px solid black";
            newCanvas.style.margin = "10px";
            document.body.appendChild(newCanvas);

            let ctx = newCanvas.getContext("2d");
            crtajTriangulacijuNaPlatnu(ctx, potskupVrhova, triangulacija);
        });
    }
}

function crtajTriangulacijuNaPlatnu(ctx, vrhovi, triangulacija) {
    ctx.beginPath();
    ctx.moveTo(vrhovi[0][0], vrhovi[0][1]);
    for (let i = 1; i < vrhovi.length; i++) {
        ctx.lineTo(vrhovi[i][0], vrhovi[i][1]);
    }
    ctx.closePath();
    ctx.stroke();

    for (let [pocetak, kraj] of triangulacija) {
        const [x1, y1] = vrhovi[pocetak - 1];
        const [x2, y2] = vrhovi[kraj - 1];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}



	

        document.getElementById("triangulationCanvas").addEventListener("click", dodajVrh);
