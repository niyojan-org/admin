import { useEffect, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Transformer, Group } from "react-konva";
import useImage from "use-image";

// Image component for field images
function FieldImage({ field, selectedId, onSelectField, onDragEnd, onTransformEnd, imageWidth, imageHeight, index }) {
  const [image, status] = useImage(field.imageUrl || "", "anonymous");
  const isSelected = selectedId === field.id;
  const hasValidUrl = field.imageUrl && field.imageUrl.trim() !== "";

  return (
    <Group
      id={field.id}
      x={field.x}
      y={field.y}
      draggable
      onClick={() => onSelectField(field)}
      onTap={() => onSelectField(field)}
      onDragEnd={(e) => onDragEnd(index, e)}
      onTransformEnd={(e) => onTransformEnd(index, e, field)}
      dragBoundFunc={(pos) => ({
        x: Math.max(0, Math.min(pos.x, imageWidth - (field.width || 150))),
        y: Math.max(0, Math.min(pos.y, imageHeight - (field.height || 80)))
      })}
      rotation={field.rotation || 0}
      opacity={field.opacity !== undefined ? field.opacity : 1}
    >
      {image && status === "loaded" && (
        <Image
          image={image}
          width={field.width || 150}
          height={field.height || 80}
          stroke={isSelected ? "#3b82f6" : "transparent"}
          strokeWidth={isSelected ? 2 : 0}
        />
      )}
      {(!image || status !== "loaded") && (
        <Rect
          width={field.width || 150}
          height={field.height || 80}
          fill={hasValidUrl ? "rgba(100, 150, 255, 0.2)" : "rgba(200, 200, 200, 0.3)"}
          stroke={isSelected ? "#3b82f6" : "#999"}
          strokeWidth={isSelected ? 2 : 1}
          dash={[5, 5]}
        />
      )}
      {(!image || status !== "loaded") && hasValidUrl && (
        <Text
          text={status === "loading" ? "Loading..." : status === "failed" ? "Failed to load" : "Enter URL"}
          x={0}
          y={(field.height || 80) / 2 - 6}
          width={field.width || 150}
          align="center"
          fontSize={12}
          fill="#666"
        />
      )}
    </Group>
  );
}

export default function TicketCanvas({
  containerRef,
  stageRef,
  transformerRef,
  bgImage,
  imageDimensions,
  fields,
  selectedId,
  onSelectField,
  onDeselectAll,
  onFieldDragEnd,
  onFieldTransformEnd,
  scale,
  onSave
}) {
  // Transformer effect
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode && transformerRef.current) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, transformerRef, stageRef]);

  const { width: imageWidth, height: imageHeight } = imageDimensions;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center justify-center bg-card rounded-2xl"
    >
      <button
        type="button"
        onClick={onSave}
        className="absolute top-3 right-3 z-10 inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Save
      </button>
      <div className="shadow-2xl rounded-lg overflow-hidden border ">
        <Stage
          ref={stageRef}
          width={imageWidth * scale}
          height={imageHeight * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) {
              onDeselectAll();
            }
          }}
          className=""
        >
          <Layer>
            {bgImage && (
              <Image
                image={bgImage}
                width={imageWidth}
                height={imageHeight}
                listening={false}
              />
            )}

            {fields.map((f, i) => {
              // Image Field
              if (f.isImage) {
                return (
                  <FieldImage
                    key={f.id}
                    field={f}
                    selectedId={selectedId}
                    onSelectField={onSelectField}
                    onDragEnd={onFieldDragEnd}
                    onTransformEnd={onFieldTransformEnd}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                    index={i}
                  />
                );
              }

              // QR Code Field
              if (f.isQR) {
                const qrSize = f.width || f.size;
                return (
                  <Group 
                    key={f.id}
                    rotation={f.rotation || 0}
                    opacity={f.opacity !== undefined ? f.opacity : 1}
                  >
                    {/* Soft neon glow background */}
                    <Rect
                      x={f.x - 8}
                      y={f.y - 8}
                      width={qrSize + 16}
                      height={qrSize + 16}
                      fill="rgba(59, 130, 246, 0.1)"
                      cornerRadius={8}
                      shadowColor="rgba(59, 130, 246, 0.5)"
                      shadowBlur={20}
                      shadowOpacity={0.6}
                      listening={false}
                    />
                    {/* QR Code box */}
                    <Rect
                      id={f.id}
                      x={f.x}
                      y={f.y}
                      width={qrSize}
                      height={qrSize}
                      fill="#ffffff"
                      stroke={selectedId === f.id ? "#3b82f6" : "rgba(59, 130, 246, 0.5)"}
                      strokeWidth={selectedId === f.id ? 3 : 2}
                      cornerRadius={4}
                      shadowColor="rgba(59, 130, 246, 0.3)"
                      shadowBlur={10}
                      shadowOpacity={0.5}
                      draggable
                      onClick={() => onSelectField(f)}
                      onTap={() => onSelectField(f)}
                      onDragEnd={(e) => onFieldDragEnd(i, e)}
                      onTransformEnd={(e) => onFieldTransformEnd(i, e, f)}
                      dragBoundFunc={(pos) => ({
                        x: Math.max(0, Math.min(pos.x, imageWidth - qrSize)),
                        y: Math.max(0, Math.min(pos.y, imageHeight - qrSize))
                      })}
                    />
                  </Group>
                );
              }

              // Text Field
              const textContent = `{{${f.key}}}`;

              return (
                <Text
                  key={f.id}
                  id={f.id}
                  text={textContent}
                  x={f.x}
                  y={f.y}
                  fontSize={f.fontSize}
                  fill={f.color}
                  fontFamily={f.fontFamily}
                  fontStyle={f.fontWeight === "bold" ? "bold" : f.fontWeight === "semibold" ? "600" : "normal"}
                  align={f.align}
                  lineHeight={f.lineHeight || 1.2}
                  rotation={f.rotation || 0}
                  opacity={f.opacity !== undefined ? f.opacity : 1}
                  draggable
                  onClick={() => onSelectField(f)}
                  onTap={() => onSelectField(f)}
                  onDragEnd={(e) => onFieldDragEnd(i, e)}
                  dragBoundFunc={(pos) => ({
                    x: Math.max(0, Math.min(pos.x, imageWidth - 50)),
                    y: Math.max(0, Math.min(pos.y, imageHeight - f.fontSize))
                  })}
                />
              );
            })}

            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 50 || newBox.height < 50) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
