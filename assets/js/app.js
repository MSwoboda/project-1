$("#submit").click(function(event) {
    event.preventDefault();
});


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();


//Search String and API Data
const app_id = "60bec2ae";
const app_key = "411a6ce9c56353f66bde23265db8f48d";
let queryURL = `https://api.edamam.com/search?`

//Get Form Data
//Query String
let q = "vegan" //$("#foodName ").val();
let cousineType = "chinese" //$("#cousineType ").val();

var caloriesMin = 500 //$("#caloriesMin ").val();
var caloriesMax = 1000 //$("#caloriesMax ").val();

let health = ["peanut-free ", "tree-nut-free"];


$.ajax({
    url: queryURL,
    method: "GET",
    data: {
        q,
        app_id,
        app_key,
        health,
        calories: `${caloriesMin}-${caloriesMax}`
    },
    success: function(response) {
        console.log(response);

        addRecipes(response.hits);
    },
    error: function(xhr) {
        console.log(xhr);
    }
});

function addRecipes(recipeArray) {

    console.log(recipeArray);

    for (let index = 0; index < recipeArray.length; index++) {

        let rLabel = recipeArray[index].recipe.label;
        let rCals = Math.floor(recipeArray[index].recipe.calories);
        let rImg = recipeArray[index].recipe.image;
        let rLink = recipeArray[index].recipe.url;

        ///
        let rIngredientList = `<ul>`
        for (let i = 0; i < recipeArray[index].recipe.ingredients.length; i++) {
            rIngredientList += `<li>${recipeArray[index].recipe.ingredients[i].food} </li>`
        }
        rIngredientList += `</ul>`
            ///

        let rTagList = ``;
        let healthLabels = recipeArray[index].recipe.healthLabels; //Array

        if (healthLabels.includes("Gluten-Free")) {
            rTagList += `<span class="badge badge-pill badge-danger mr-2">Gluten-Free</span>`;
        }

        if (healthLabels.includes("Keto")) {
            rTagList += `<span class="badge badge-pill badge-warning mr-2">Keto</span>`;
        }

        if (healthLabels.includes("Vegan")) {
            rTagList += `<span class="badge badge-pill badge-success mr-2">Vegan</span>`;
        }

        if (healthLabels.includes("Low-Sodium")) {
            rTagList += `<span class="badge badge-pill badge-primary mr-2">Low-Sodium</span>`;
        }

        if (healthLabels.includes("Vegetarian")) {
            rTagList += `<span class="badge badge-pill badge-info">Vegetarian</span>`;
        }



        $("#recipe-list").append(
                `<div class="accordion" id="recipe-list">
            <div class="card">
            <div class="card-header" id="heading${index}">
            <h6 class="mb-0">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
             ${rLabel}
              </button> Calories: ${rCals}kcal
              ${rTagList}
            </h6>
            </div>
            <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#recipe-list">
            <div class="card-body">

            <div class="row">
                <div class="col-3 text-center">
                    <img src=${rImg} class="img-fluid" style="max-width:100%;" alt="Recipe Image :)">
                    <br>
                    <br>
                    <a class="btn btn-primary center-block" target="_blank" href=${rLink} role="button">Recipe</a>

                </div>
                <div class="col-3 ">
                    <h4>Ingredients:</h4>
                    ${rIngredientList}
                </div>
                <div class="col-6 ">
                <br>
                <br>
                <br>
                <br>
                        <div id="chart${rLabel}"  style="width:100%; height:100%; position:relative; right: 80px; bottom: 70px;" ></div>		

            </div>

            </div>

        </div>
    </div>
</div>
</div>`
            ) //end of template

        // Add data
        myData = [{
                "country": "Carbs",
                "visits": recipeArray[index].recipe.totalDaily.CHOCDF.quantity
            }, {
                "country": "Saturated Fat",
                "visits": recipeArray[index].recipe.totalDaily.FASAT.quantity
            }, {
                "country": "Fat",
                "visits": recipeArray[index].recipe.totalDaily.FAT.quantity
            }, {
                "country": "Iron",
                "visits": recipeArray[index].recipe.totalDaily.FE.quantity
            }, {
                "country": "Fiber",
                "visits": recipeArray[index].recipe.totalDaily.FIBTG.quantity
            }, {
                "country": "Sodium",
                "visits": recipeArray[index].recipe.totalDaily.NA.quantity
            }, {
                "country": "Protein",
                "visits": recipeArray[index].recipe.totalDaily.PROCNT.quantity
            }
            // , {
            //     "country": "Spain",
            //     "visits": 711
            // }, {
            //     "country": "Netherlands",
            //     "visits": 665
            // }, {
            //     "country": "Russia",
            //     "visits": 580
            // }, {
            //     "country": "South Korea",
            //     "visits": 443
            // }, {
            //     "country": "Canada",
            //     "visits": 441
            // }
        ];
        createChart(myData, "chart" + rLabel);
    }
}

function createChart(cNutrients, cName) {

    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create(cName, am4charts.XYChart);
        //chart.scrollbarX = new am4core.Scrollbar();

        // Add data
        chart.data = cNutrients;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = false;
        categoryAxis.renderer.minHeight = 100;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 100;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function(fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
        chart.responsive.enable = true;
        // Cursor
        chart.cursor = new am4charts.XYCursor();

    }); // end am4core.ready()

}