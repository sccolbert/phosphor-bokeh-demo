
import * as arrays from 'phosphor-arrays';

import {
  IDisposable
} from 'phosphor-disposable';

import {
  IChangedArgs
} from 'phosphor-properties';

import {
  ISignal, Signal, clearSignalData
} from 'phosphor-signaling';

import * as utils from './utils';


/**
 * A model for the available data.
 */
export
class ItemModel {

  constructor(dataType: string, name: string, data: any) {
    this.type = dataType;
    this.name = name;
    this._data = data;
  }

  type: string = null;
  name: string = '';
  private _data: any;
}

/**
 * A data browser model.
 */
export
class DataBrowserModel implements IDisposable {
  constructor() {
  }

  /**
   * Get the selection changed signal.
   */
  get selectionChanged(): ISignal<DataBrowserModel, void> {
    return Private.selectionChangedSignal.bind(this);
  }

  /**
   * Get the refreshed signal.
   */
  get refreshed(): ISignal<DataBrowserModel, void> {
    return Private.refreshedSignal.bind(this);
  }

  get isDisposed(): boolean {
    return this._items === null;
  }

  get sortedItems(): ItemModel[] {
    return this._items;
  }

  refresh() {
    console.log('Refresh model...');
    this.refreshed.emit(void 0);
  }

  addItems(items: ItemModel[]) {
    for (let i = 0; i < items.length; ++i) {
      this._items.push(items[i]);
    }
    this.refresh();
  }

  /**
   * Select an item by name.
   */
  select(name: string): void {
    if (!this._selection[name]) {
      this._selection[name] = true;
      this.selectionChanged.emit(void 0);
    }
  }

  /**
   * De-select an item by name.
   */
  deselect(name: string): void {
    if (this._selection[name]) {
      delete this._selection[name];
      this.selectionChanged.emit(void 0);
    }
  }

  /**
   * Check whether an item is selected.
   */
  isSelected(name: string): boolean {
    return !!this._selection[name];
  }

  /**
   * Get the list of selected names.
   */
  getSelected(): string[] {
    return Object.keys(this._selection);
  }

  /**
   * Clear the selected items.
   */
  clearSelected(): void {
    this._selection = Object.create(null);
    this.selectionChanged.emit(void 0);
  }

  /**
   * Dispose of the resources held by the view model.
   */
  dispose(): void {
    this._selection = null;
    clearSignalData(this);
  }

  open(name: string): Promise<any> {
    console.log('Open data item: ', name);
    return Promise.resolve();
  }

  private _items: ItemModel[] = [];
  private _selection: { [key: string]: boolean; } = Object.create(null);
}


/**
 * The namespace for the private data.
 */
namespace Private {
  /**
   * A signal emitted when the data is refreshed.
   */
  export
  const refreshedSignal = new Signal<DataBrowserModel, void>();

  /**
   * A signal emitted when the selection changes.
   */
  export
  const selectionChangedSignal = new Signal<DataBrowserModel, void>();
}