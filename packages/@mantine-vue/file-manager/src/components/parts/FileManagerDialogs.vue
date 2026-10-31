<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Button, Checkbox, Group, Modal, Stack, Text, TextInput } from '@mantine-vue/core'
import { getFileNameIssue, splitFileName } from '../../core/paths'
import { useFileManagerContext } from '../../FileManager.context'
import { ROOT_FOLDER_KEY } from '../../composables/use-file-manager-ui'
import FileManagerEntryInfo from './FileManagerEntryInfo.vue'
import FileManagerFolderTree from './FileManagerFolderTree.vue'

defineOptions({ name: 'FileManagerDialogs' })

const { controller, labels, ui, compact, getStyles } = useFileManagerContext()

const dialog = ui.dialog

/* Name prompt, shared by new folder and rename */

const nameDialog = computed(() =>
  dialog.value?.type === 'newFolder' || dialog.value?.type === 'rename' ? dialog.value : null,
)
const name = ref('')
const touched = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)

const originalName = computed(() =>
  nameDialog.value?.type === 'rename' ? nameDialog.value.entry.name : null,
)

watch(nameDialog, (value) => {
  if (!value) {
    return
  }

  touched.value = false
  name.value = originalName.value ?? labels.value.defaultFolderName

  // The name is selected without its extension, which is rarely what is being changed.
  void nextTick(() => {
    const input = nameInput.value

    input?.focus()
    input?.setSelectionRange(0, splitFileName(name.value).base.length)
  })
})

const nameError = computed(() => {
  const issue = getFileNameIssue(name.value)

  if (issue) {
    return labels.value.nameIssues[issue]
  }

  const lower = name.value.toLowerCase()
  const taken = controller.items.value.some(
    (entry) => entry.name.toLowerCase() === lower && entry.name !== originalName.value,
  )

  return taken ? labels.value.nameIssues.exists : null
})

function submitName() {
  touched.value = true

  if (nameError.value || !nameDialog.value) {
    return
  }

  const current = nameDialog.value

  ui.closeDialog()

  void (current.type === 'rename'
    ? controller.rename(current.entry, name.value)
    : controller.createFolder(name.value))
}

/* Destination picker */

const transfer = computed(() => (dialog.value?.type === 'transfer' ? dialog.value : null))
const destination = ref<string | null>(null)

watch(transfer, (value) => {
  if (value) {
    destination.value = controller.currentFolderId.value ?? null
  }
})

const destinationKey = computed(() =>
  controller.isSameFolder(destination.value, null)
    ? ROOT_FOLDER_KEY
    : (destination.value ?? ROOT_FOLDER_KEY),
)

const canTransferHere = computed(() => {
  const value = transfer.value

  return (
    !!value &&
    !value.entries.some(
      (entry) =>
        entry.id === destination.value ||
        (value.mode === 'move' && controller.isSameFolder(entry.parentId, destination.value)),
    )
  )
})

function submitTransfer() {
  const value = transfer.value

  if (!value || !canTransferHere.value) {
    return
  }

  ui.closeDialog()
  void (value.mode === 'move'
    ? controller.move(value.entries, destination.value)
    : controller.copy(value.entries, destination.value))
}

/* Properties */

const properties = computed(() => (dialog.value?.type === 'properties' ? dialog.value : null))

/* Prompts of the controller */

const confirm = ui.confirmRequest
const conflict = ui.conflictRequest
const applyToAll = ref(false)

watch(conflict, () => {
  applyToAll.value = false
})

const answerConflict = (strategy: 'overwrite' | 'rename' | 'skip' | null) =>
  ui.answerConflict({ strategy, applyToAll: applyToAll.value })

const closeNameDialog = () => ui.closeDialog()

// The element that opened a dialog is often a menu item that no longer exists.
watch([dialog, confirm, conflict], (current, previous) => {
  if (previous.some(Boolean) && !current.some(Boolean)) {
    ui.focusContent()
  }
})

// Finishing an operation can remove the focused row, which would drop focus to the document and
// take the keyboard shortcuts with it.
watch(controller.pendingOperations, (count) => {
  if (count === 0 && document.activeElement === document.body) {
    ui.focusContent()
  }
})
</script>

<template>
  <Modal
    v-bind="getStyles('portal')"
    :return-focus="false"
    :opened="!!nameDialog"
    :title="
      nameDialog?.type === 'rename'
        ? labels.renameTitle(nameDialog.entry.name)
        : labels.newFolderTitle
    "
    size="sm"
    :full-screen="false"
    data-fm-dialog="name"
    @close="closeNameDialog"
  >
    <form novalidate @submit.prevent="submitName">
      <Stack gap="sm">
        <TextInput
          :ref="(node: any) => (nameInput = node?.$el?.querySelector?.('input') ?? node)"
          v-model="name"
          :label="nameDialog?.type === 'rename' ? labels.newName : labels.newFolderName"
          :error="touched ? nameError : undefined"
          data-autofocus
          data-fm-name-input
          @input="touched = true"
        />
        <Group justify="flex-end" gap="xs">
          <Button variant="default" @click="closeNameDialog">{{ labels.cancel }}</Button>
          <Button type="submit" data-fm-submit>
            {{ nameDialog?.type === 'rename' ? labels.save : labels.create }}
          </Button>
        </Group>
      </Stack>
    </form>
  </Modal>

  <Modal
    v-bind="getStyles('portal')"
    :return-focus="false"
    :opened="!!transfer"
    :title="
      transfer?.mode === 'copy'
        ? labels.copyToTitle(transfer.entries.length)
        : labels.moveToTitle(transfer?.entries.length ?? 0)
    "
    :full-screen="compact"
    data-fm-dialog="transfer"
    @close="ui.closeDialog()"
  >
    <Stack gap="sm">
      <Text size="sm" c="dimmed">{{ labels.chooseFolder }}</Text>
      <FileManagerFolderTree
        v-if="transfer"
        :selected="destinationKey"
        :label="labels.chooseFolder"
        @select="destination = $event"
      />
      <Group justify="flex-end" gap="xs">
        <Button variant="default" @click="ui.closeDialog()">{{ labels.cancel }}</Button>
        <Button :disabled="!canTransferHere" data-fm-submit @click="submitTransfer">
          {{ transfer?.mode === 'copy' ? labels.copyHere : labels.moveHere }}
        </Button>
      </Group>
    </Stack>
  </Modal>

  <Modal
    v-bind="getStyles('portal')"
    :return-focus="false"
    :opened="!!properties"
    :title="properties ? labels.propertiesTitle(properties.entry.name) : ''"
    size="sm"
    :full-screen="compact"
    data-fm-dialog="properties"
    @close="ui.closeDialog()"
  >
    <FileManagerEntryInfo v-if="properties" :entry="properties.entry" />
  </Modal>

  <Modal
    v-bind="getStyles('portal')"
    :return-focus="false"
    :opened="!!confirm"
    :title="confirm?.title"
    size="sm"
    role="alertdialog"
    data-fm-dialog="confirm"
    @close="ui.answerConfirm(false)"
  >
    <Stack gap="md">
      <Text size="sm" style="overflow-wrap: anywhere">{{ confirm?.message }}</Text>
      <Group justify="flex-end" gap="xs">
        <Button variant="default" data-autofocus @click="ui.answerConfirm(false)">
          {{ labels.cancel }}
        </Button>
        <Button
          :color="confirm?.kind === 'trash' ? undefined : 'red'"
          data-fm-submit
          @click="ui.answerConfirm(true)"
        >
          {{ confirm?.confirmLabel ?? labels.confirm }}
        </Button>
      </Group>
    </Stack>
  </Modal>

  <Modal
    v-bind="getStyles('portal')"
    :return-focus="false"
    :opened="!!conflict"
    :title="labels.conflictTitle"
    size="md"
    data-fm-dialog="conflict"
    @close="answerConflict(null)"
  >
    <Stack gap="md">
      <Text size="sm" style="overflow-wrap: anywhere">
        {{ conflict ? labels.conflictMessage(conflict.name, conflict.destination) : '' }}
      </Text>
      <Text v-if="conflict && conflict.remaining > 0" size="xs" c="dimmed">
        {{ labels.conflictRemaining(conflict.remaining) }}
      </Text>
      <Checkbox
        v-if="conflict && conflict.remaining > 0"
        v-model:checked="applyToAll"
        size="xs"
        :label="labels.applyToAll"
      />
      <Group justify="flex-end" gap="xs">
        <Button variant="default" data-fm-conflict="skip" @click="answerConflict('skip')">
          {{ labels.skip }}
        </Button>
        <Button variant="default" data-fm-conflict="rename" @click="answerConflict('rename')">
          {{ labels.keepBoth }}
        </Button>
        <Button color="red" data-fm-conflict="overwrite" @click="answerConflict('overwrite')">
          {{ labels.overwrite }}
        </Button>
      </Group>
    </Stack>
  </Modal>
</template>
