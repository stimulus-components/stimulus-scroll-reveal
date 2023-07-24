import { Controller } from '@hotwired/stimulus'

interface Option {
  class?: string
  threshold?: number
  rootMargin?: string
}

export default class extends Controller {
  classValue: string
  thresholdValue: number
  rootMarginValue: string

  class: string
  threshold: number
  rootMargin: string
  isInitialized: boolean
  observer: IntersectionObserver

  itemTargets: HTMLElement[]

  static targets = ['item']
  static values = {
    class: String,
    threshold: Number,
    rootMargin: String
  }

  initialize (): void {
    this.isInitialized = false
    this.intersectionObserverCallback = this.intersectionObserverCallback.bind(this)
  }

  connect (): void {
    this.class = this.classValue || this.defaultOptions.class || 'in'
    this.threshold = this.thresholdValue || this.defaultOptions.threshold || 0.1
    this.rootMargin = this.rootMarginValue || this.defaultOptions.rootMargin || '0px'

    this.observer = new IntersectionObserver(this.intersectionObserverCallback, this.intersectionObserverOptions)
    this.itemTargets.forEach(item => this.observer.observe(item))
    this.isInitialized = true
  }

  disconnect (): void {
    this.itemTargets.forEach(item => this.observer.unobserve(item))
    this.observer.disconnect()
  }

  intersectionObserverCallback (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    entries.forEach(entry => {
      if (entry.intersectionRatio > this.threshold) {
        const target = entry.target as HTMLElement
        target.classList.add(...this.class.split(' '))

        if (target.dataset.delay) {
          target.style.transitionDelay = target.dataset.delay
        }

        observer.unobserve(target)
      }
    })
  }

  itemTargetConnected() {
    if (this.isInitialized) {
      this.itemTargets.forEach(item => this.observer.observe(item))
    }
  }

  get intersectionObserverOptions (): IntersectionObserverInit {
    return {
      threshold: this.threshold,
      rootMargin: this.rootMargin
    }
  }

  get defaultOptions (): Option {
    return {}
  }
}
