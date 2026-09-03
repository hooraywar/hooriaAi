-- New modules were always inserted with sort_order = 0 (a dialog default),
-- so several rows in "AI App Development with RAG & Agents" ended up tied
-- and rendered out of order. Re-sequence them to match module_number.
UPDATE public.curriculum_modules SET sort_order = 1
WHERE id = '2cf3087c-dc27-4c4d-ae6e-ff97197fc0e5'; -- 02 Building RAG Pipelines

UPDATE public.curriculum_modules SET sort_order = 2
WHERE id = 'f61db510-e9dd-4448-9f0f-1923451e3a56'; -- 03

UPDATE public.curriculum_modules SET sort_order = 3
WHERE id = '582015e1-a85a-4de9-9066-6695927727f3'; -- 04

UPDATE public.curriculum_modules SET sort_order = 4
WHERE id = '582fd445-173f-42e5-a790-2b941a45ca3d'; -- 05
