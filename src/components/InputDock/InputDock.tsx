import { Button, TextArea, TextField } from '@heroui/react'

import type { InputDockProps } from './InputDock.types'

export default function InputDock({ input, isLoading, onChange, onKeyDown, onSend, textareaRef }: InputDockProps) {
  return (
    <div className="relative z-10 border-t border-bark/50 bg-char/90 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto max-w-2xl">
        <div className="input-wrap rounded-2xl border border-bark bg-ash/70 px-4 pb-3 pt-3.5 transition-[border-color] duration-200 focus-within:border-ember/30">
          <TextField className="w-full" onChange={onChange} value={input}>
            <TextArea
              className="w-full max-h-24 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-cream shadow-none outline-none placeholder:text-smoke/40 focus:ring-0 focus:shadow-none data-[focused=true]:ring-0 data-[focused=true]:shadow-none"
              onKeyDown={onKeyDown}
              placeholder="Describe your ideal meal prep week…"
              ref={textareaRef}
            />
          </TextField>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="hidden text-[9px] tracking-[0.2em] text-smoke/30 uppercase sm:block">
              Enter to send · Shift+Enter for new line
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                className="h-auto rounded-lg border border-moss/30 px-3 py-1.5 text-xs text-moss/65 hover:border-moss/55 hover:text-moss"
                onPress={() => {/* TBD: navigate to /create */ }}
                variant="ghost"
              >
                Create yourself
              </Button>
              <Button
                className="h-auto rounded-lg px-4 py-1.5 text-xs font-medium"
                isDisabled={!input.trim() || isLoading}
                onPress={onSend}
                variant="primary"
              >
                Ask
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
