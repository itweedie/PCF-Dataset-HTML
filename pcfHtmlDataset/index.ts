// Import necessary interfaces from the PCF framework
import {IInputs, IOutputs} from "./generated/ManifestTypes";

// Import DataSet interfaces for use with dataset properties
// The next line resolves the error  'PropertyHelper' is not defined  no-undef
// eslint-disable-next-line no-undef
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

// Define type alias for DataSet for convenience
type DataSet = ComponentFramework.PropertyTypes.DataSet;



// Class definition for your PCF control
export class pcfHtmlDataset implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // A reference to the HTML div container that will host the control
    private container: HTMLDivElement;

    // Constructor for the control class
    constructor() {
        // Constructor can be used for any initial setup. Currently empty.
    }

    /**
     * Initializes the control instance.
     * This is where controls can start off processes such as server calls,
     * initializing state, etc. Dataset values are not initialized here,
     * so any operations on datasets should occur in updateView.
     * @param context - Provides the context in which the control is embedded. 
     *                  Contains values as set up by the customizer and utility functions.
     * @param notifyOutputChanged - A callback to alert the framework of changes to control outputs.
     * @param state - Holds a piece of data for a single user in a single session.
     * @param container - The div element that will contain the control's rendered output.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Store a reference to the container element
        this.container = container;
        // Additional initialization logic can be added here
    }

    /**
     * Called when any value in the property bag has changed.
     * This includes field values, datasets, and global values like container height/width.
     * @param context - The context object providing values and utility functions.
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Clear any existing content in the container
        this.container.innerHTML = "";

        // Create a table element for displaying data
        let table = document.createElement("table");

        // Create and append the header row to the table
        let headerRow = this.createHeaderRow(context);
        table.appendChild(headerRow);

        // Create and append data rows to the table
        this.createDataRows(context, table);

        // Append the completed table to the container
        this.container.appendChild(table);
    }

    /**
     * Creates a header row for the table based on dataset columns.
     * @param context - The context object providing dataset information.
     * @returns A HTMLTableRowElement representing the header row.
     */
    private createHeaderRow(context: ComponentFramework.Context<IInputs>): HTMLTableRowElement {
        // Create a table row for headers
        let headerRow = document.createElement("tr");
        // Iterate over each column in the dataset and create a header cell
        context.parameters.sampleDataSet.columns.forEach((column: DataSetInterfaces.Column) => {
            let headerCell = document.createElement("th");
            headerCell.innerHTML = column.displayName;
            headerRow.appendChild(headerCell);
        });
        return headerRow;
    }

    /**
     * Creates and appends data rows to the table based on the dataset records.
     * @param context - The context object providing dataset and record information.
     * @param table - The table element to which rows will be appended.
     */
    private createDataRows(context: ComponentFramework.Context<IInputs>, table: HTMLTableElement): void {
        // Iterate over each record in the dataset
        context.parameters.sampleDataSet.sortedRecordIds.forEach((recordId) => {
            let currentRecord = context.parameters.sampleDataSet.records[recordId];
            let tableRow = document.createElement("tr");

            // For each column, create a cell in the row and fill it with data
            context.parameters.sampleDataSet.columns.forEach((column: DataSetInterfaces.Column) => {
                let tableRowCell = document.createElement("td");
                tableRowCell.innerHTML = currentRecord.getFormattedValue(column.name);
                tableRow.appendChild(tableRowCell);
            });

            // Append the completed row to the table
            table.appendChild(tableRow);
        });
    }

    /**
     * Called by the framework before the control receives new data.
     * This can be used to return a data object based on the control's current state.
     * @returns An object that represents updated data for the control.
     */
    public getOutputs(): IOutputs {
        // Return an empty object as this control has no outputs.
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM.
     * This is where cleanup operations like cancelling pending calls,
     * removing listeners, etc. should happen.
     */
    public destroy(): void {
        // Implement any necessary cleanup operations here
    }
}