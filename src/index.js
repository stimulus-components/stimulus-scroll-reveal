import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['item']
  static values = {
    class: String,
    threshold: Number,
    rootMargin: String
  }

  initialize () {
    this.intersectionObserverCallback = this.intersectionObserverCallback.bind(this)
  }

  connect () {
    this.class = this.classValue || this.defaultOptions.class || 'in'
    this.threshold = this.thresholdValue || this.defaultOptions.threshold || '0.1'
    this.rootMargin = this.rootMarginValue || this.defaultOptions.rootMargin || '0px'

    this.observer = new IntersectionObserver(this.intersectionObserverCallback, this.intersectionObserverOptions)
    this.itemTargets.forEach(item => this.observer.observe(item))
  }

  disconnect () {
    this.itemTargets.forEach(item => this.observer.unobserve(item))
  }

  intersectionObserverCallback (entries, observer) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > this.threshold) {
        entry.target.classList.add(this.class)

        if (entry.target.dataset.delay) {
          entry.target.style.transitionDelay = entry.target.dataset.delay
        }

        observer.unobserve(entry.target)
      }
    })
  }

  get intersectionObserverOptions () {
    return {
      threshold: this.threshold,
      rootMargin: this.rootMargin
    }
  }

  get defaultOptions () {
    return {}
  }
}
