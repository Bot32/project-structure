import RangePicker from '../../components/range-picker/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import ColumnChart from '../../components/column-chart/index.js';
import header from './bestsellers-header.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {

  onDateSelect = event => {
    const {from, to} = event.detail;
    this.columnChartOrders.update(from, to);
    this.columnChartSales.update(from, to);
    this.columnChartCustomers.update(from, to);
    this.sortableTable.update(event.detail);
  }

  constructor() {
    this.init();
  }

  init() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    this.initEventListeners();
  }

  render() {
    const from = new Date();
    const to = new Date();
    from.setDate(to.getDate() - 30);

    this.rangePicker = new RangePicker({ from: from, to: to });
    this.rangePicker.element.dataset.pageElement = 'rangePicker';
    this.subElements.rangePickerContainer.append(this.rangePicker.element);

    const range = { from: from, to: to };

    this.columnChartOrders = new ColumnChart({ label: 'orders', link: '/orders', url: 'api/dashboard/orders', range: range });
    this.columnChartOrders.element.dataset.pageElement = 'ordersChart';
    this.subElements.columnChartOrdersContainer.append(this.columnChartOrders.element);

    this.columnChartSales = new ColumnChart({ label: 'sales', link: '/sales', url: 'api/dashboard/sales', range: range });
    this.columnChartSales.element.dataset.pageElement = 'salesChart';
    this.subElements.columnChartSalesContainer.append(this.columnChartSales.element);

    this.columnChartCustomers = new ColumnChart({ label: 'customers', link: '/customers', url: 'api/dashboard/customers', range: range });
    this.columnChartCustomers.element.dataset.pageElement = 'customersChart';
    this.subElements.columnChartCustomersContainer.append(this.columnChartCustomers.element);
    
    this.sortableTable = new SortableTable(header, { url: 'api/dashboard/bestsellers', isSortLocally: true});
    this.sortableTable.element.dataset.pageElement = 'sortableTable';
    this.subElements.sortableTableContainer.append(this.sortableTable.element);

    this.subElements = this.getSubElements(this.element);

    return this.element;
  }

  getTemplate() {
    return `
      <div class="dashboard full-height flex-column">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <div data-page-element="rangePickerContainer"></div>
        </div>
        <div data-page-element="columncChartsContainer" class="dashboard__charts">
          <div data-page-element="columnChartOrdersContainer" class="dashboard__chart_orders"></div>
          <div data-page-element="columnChartSalesContainer" class="dashboard__chart_sales"></div>
          <div data-page-element="columnChartCustomersContainer" class="dashboard__chart_customers"></div>
        </div>
        <h3 class="block-title">Лидеры продаж</h3>
        <div data-page-element="sortableTableContainer"></div>
      </div>
    `;
  }

  getSubElements(element) {
    const subElements = {};

    for (const subElement of element.querySelectorAll('[data-page-element]')) {
      subElements[subElement.dataset.pageElement] = subElement;
    }

    return subElements;
  }

  initEventListeners() {
    this.element.addEventListener('date-select', this.onDateSelect);
  }

  remove() {
    //TODO remove components
    this.element?.remove();
  }

  destroy() {
    this.element?.remove();
  }
}
