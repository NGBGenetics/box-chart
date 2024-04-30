# BOX CHART

Webcomponents examples for drawing a microbiome graph.

```html
<p>
    <h2>Single:</h2>
    <box-chart
        height="40"
        box-start="200"
        box-width="300"
        dot-position="280"
    ></box-chart>
</p>

<p>
    <h2>Multi:</h2>
    <multi-box-chart
        width="1000"
        dots="7.7829587537670"
        mediane="0.183980018133"
        box="0,0.869830"
        range="0,6.77655331"
        log="true"
    ></multi-box-chart>
</p>
```

## Parameters:

Single:

- width: width of the graph
- height: height of the graph
- box-start: start of the grey box (Q1)
- box-width: width of the grey box
- dot-position: X position for he value represented as a dot
- triangle-position: mediane value, it will be represented as a yellow triangle

Examples: `./index-single.html`

https://ngbgenetics.github.io/box-chart/index-single.html

Multi:

- width: width of the graph
- dots: comma separated list (string), with values for historic dates, represented in the X axis
- mediane: yellow line representing mediane
- box: comma separated list (string), with values for the box (2 values max)
- range: comma separated list (string), for the range start and range end (2 values max)
- log: logarithmic scale to represents values
- times: dates for the Y axis

Examples: `./index.html`

https://ngbgenetics.github.io/box-chart/index.html
