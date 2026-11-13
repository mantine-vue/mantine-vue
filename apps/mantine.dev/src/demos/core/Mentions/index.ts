import { createVueDemo } from '@/demo'
import UsageDemo from './Mentions.demo.usage.vue'
import usageCode from './Mentions.demo.usage.vue?raw'
import ShowTriggerDemo from './Mentions.demo.showTrigger.vue'
import showTriggerCode from './Mentions.demo.showTrigger.vue?raw'
import RenderMentionDemo from './Mentions.demo.renderMention.vue'
import renderMentionCode from './Mentions.demo.renderMention.vue?raw'
import RenderSuggestionDemo from './Mentions.demo.renderSuggestion.vue'
import renderSuggestionCode from './Mentions.demo.renderSuggestion.vue?raw'
import MultipleTriggersDemo from './Mentions.demo.multipleTriggers.vue'
import multipleTriggersCode from './Mentions.demo.multipleTriggers.vue?raw'
import AsyncDemo from './Mentions.demo.async.vue'
import asyncCode from './Mentions.demo.async.vue?raw'
import InlineDemo from './Mentions.demo.inline.vue'
import inlineCode from './Mentions.demo.inline.vue?raw'
import CaretStylingDemo from './Mentions.demo.caretStyling.vue'
import caretStylingCode from './Mentions.demo.caretStyling.vue?raw'

export const MentionsDemos = {
  usage: createVueDemo(UsageDemo, usageCode, { maxWidth: 440, withPadding: true }),
  showTrigger: createVueDemo(ShowTriggerDemo, showTriggerCode, {
    maxWidth: 440,
    withPadding: true,
  }),
  renderMention: createVueDemo(RenderMentionDemo, renderMentionCode, {
    maxWidth: 440,
    withPadding: true,
  }),
  renderSuggestion: createVueDemo(RenderSuggestionDemo, renderSuggestionCode, {
    maxWidth: 440,
    withPadding: true,
  }),
  multipleTriggers: createVueDemo(MultipleTriggersDemo, multipleTriggersCode, {
    maxWidth: 440,
    withPadding: true,
  }),
  async: createVueDemo(AsyncDemo, asyncCode, { maxWidth: 440, withPadding: true }),
  inline: createVueDemo(InlineDemo, inlineCode, { maxWidth: 440, withPadding: true }),
  caretStyling: createVueDemo(CaretStylingDemo, caretStylingCode, {
    maxWidth: 440,
    withPadding: true,
  }),
}
