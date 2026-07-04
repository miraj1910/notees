export interface StatusBarElements {
  saveStatus: HTMLElement;
}

export const statusBar = {
  elements: null as StatusBarElements | null,

  init(elements: StatusBarElements): void {
    this.elements = elements;
  },

  setStatus(text: string): void {
    if (this.elements) {
      this.elements.saveStatus.textContent = text;
    }
  },
};
